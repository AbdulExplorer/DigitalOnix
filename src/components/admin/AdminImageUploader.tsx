"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Link as LinkIcon,
  Check,
  Loader2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase-client";
import {
  VideoMetadata,
  CompressionProgress,
  CompressionResult,
} from "@/lib/video-types";
import {
  extractVideoMetadata,
  checkDeviceCapabilities,
  startVideoCompression,
} from "@/lib/video-compressor";
import { createTusUploader } from "@/lib/tus-uploader";

interface AdminImageUploaderProps {
  label: string;
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  helperText?: string;
  maxDimension?: number;
  folder?: string;
  allowVideo?: boolean;
  onDurationDetected?: (duration: string) => void;
  mobileThresholdMB?: number;
}

function isVideoSource(urlOrName?: string | null): boolean {
  if (!urlOrName) return false;
  return (
    urlOrName.startsWith("data:video") ||
    /\.(mp4|webm|mov|m4v|ogg)($|\?)/i.test(urlOrName) ||
    urlOrName.includes("video/")
  );
}

/**
 * Compresses an image client-side to ensure it never exceeds browser storage limits
 */
async function compressImageClient(file: File, maxDim = 400, quality = 0.85): Promise<string> {
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        let output = canvas.toDataURL("image/webp", quality);
        if (!output || output.length < 50 || output.startsWith("data:,")) {
          output = canvas.toDataURL("image/png");
        }
        resolve(output);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Standard Supabase Storage fallback upload for small files or images
 */
async function uploadToSupabaseBucket(file: File | Blob, fileName: string, folder: string): Promise<string | null> {
  if (!supabase) return null;
  try {
    const fileExt = fileName.split(".").pop() || "png";
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
    const filePath = `${folder}/${cleanFileName}`;

    const candidateBuckets = ["assets", "client-logos", "public-assets", "public"];
    for (const bucket of candidateBuckets) {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: "31536000",
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });

      if (!error && data?.path) {
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        if (urlData?.publicUrl) {
          return urlData.publicUrl;
        }
      }
    }
  } catch (err) {
    console.warn("Supabase Storage upload fallback notice:", err);
  }
  return null;
}

export function AdminImageUploader({
  label,
  currentImageUrl,
  onImageChange,
  helperText = "PNG, SVG, JPG, or WEBP. Automatically optimized to < 40KB.",
  maxDimension = 400,
  folder = "clients",
  allowVideo = false,
  onDurationDetected,
  mobileThresholdMB = 75,
}: AdminImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState("");

  // Video processing states
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [mobileCheck, setMobileCheck] = useState<ReturnType<typeof checkDeviceCapabilities> | null>(null);
  const [crfQuality, setCrfQuality] = useState<number>(23); // 20 High, 23 Balanced, 25 Max
  const [processingStage, setProcessingStage] = useState<
    "idle" | "ready" | "compressing" | "uploading" | "completed" | "error"
  >("idle");
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgress | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadBytesInfo, setUploadBytesInfo] = useState<{ uploaded: number; total: number } | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active cancellation hooks
  const cancelCompressionRef = useRef<(() => void) | null>(null);
  const cancelUploadRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setPreview(currentImageUrl || null);
  }, [currentImageUrl]);

  // Clean reset when removing or cancelling
  const resetVideoWorkflow = () => {
    if (cancelCompressionRef.current) {
      cancelCompressionRef.current();
      cancelCompressionRef.current = null;
    }
    if (cancelUploadRef.current) {
      cancelUploadRef.current();
      cancelUploadRef.current = null;
    }
    setPendingVideoFile(null);
    setVideoMetadata(null);
    setMobileCheck(null);
    setProcessingStage("idle");
    setCompressionProgress(null);
    setUploadPercent(0);
    setUploadBytesInfo(null);
    setCompressionResult(null);
    setErrorMessage(null);
  };

  /**
   * Main file drop/selection orchestrator
   */
  const handleFileSelect = async (file: File) => {
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v|ogg)$/i.test(file.name);
    const isImage = file.type.startsWith("image/") || file.type === "image/svg+xml";

    if (!isImage && !isVideo) {
      alert("Please upload a valid image (PNG, JPG, SVG, WEBP) or video file (MP4, WebM, MOV).");
      return;
    }

    if (isVideo && !allowVideo) {
      alert("Video upload is only enabled when Media Type is set to Video.");
      return;
    }

    // IMAGE BRANCH: Instant canvas compression (< 40KB) + upload
    if (isImage) {
      setProcessingStage("compressing");
      try {
        const compressedDataUrl = await compressImageClient(file, maxDimension);
        const cloudUrl = await uploadToSupabaseBucket(file, file.name, folder);
        const finalUrl = cloudUrl || compressedDataUrl;
        setPreview(finalUrl);
        onImageChange(finalUrl);
      } catch (err: any) {
        console.error("Image processing error:", err);
        alert("Could not process image: " + err.message);
      } finally {
        setProcessingStage("idle");
      }
      return;
    }

    // VIDEO BRANCH: Probe metadata and prepare capability analysis
    setProcessingStage("ready");
    setPendingVideoFile(file);
    setErrorMessage(null);

    try {
      const meta = await extractVideoMetadata(file);
      setVideoMetadata(meta);
      if (onDurationDetected && meta.durationFormatted) {
        onDurationDetected(meta.durationFormatted);
      }

      // Check mobile limitations & 75MB threshold
      const caps = checkDeviceCapabilities(file.size, mobileThresholdMB);
      setMobileCheck(caps);
    } catch (err: any) {
      console.warn("Could not probe video metadata:", err);
    }
  };

  /**
   * Executes the video compression pipeline followed by resumable TUS upload
   */
  const startCompressionAndUpload = async (skipCompression = false) => {
    if (!pendingVideoFile) return;

    try {
      let fileToUpload: File = pendingVideoFile;

      // 1. COMPRESSION STEP (unless skipped by mobile override)
      if (!skipCompression) {
        setProcessingStage("compressing");
        const { promise, cancel } = startVideoCompression({
          file: pendingVideoFile,
          settings: { crf: crfQuality },
          metadata: videoMetadata || undefined,
          onProgress: (p) => setCompressionProgress(p),
        });

        cancelCompressionRef.current = cancel;
        const result = await promise;
        cancelCompressionRef.current = null;

        setCompressionResult(result);
        fileToUpload = result.outputFile;
      }

      // 2. RESUMABLE TUS UPLOAD (6MB chunks)
      setProcessingStage("uploading");
      setUploadPercent(0);

      const tusUploader = createTusUploader({
        file: fileToUpload,
        fileName: fileToUpload.name,
        folder,
        bucketName: "assets",
        chunkSize: 6 * 1024 * 1024, // 6 MB chunk size
        onProgress: (pct, bytesUp, bytesTot) => {
          setUploadPercent(pct);
          setUploadBytesInfo({ uploaded: bytesUp, total: bytesTot });
        },
        onSuccess: (publicUrl) => {
          setPreview(publicUrl);
          onImageChange(publicUrl);
          setProcessingStage("completed");
        },
        onError: (err) => {
          setProcessingStage("error");
          setErrorMessage(err.message || "Upload failed. Please check network connection.");
        },
      });

      cancelUploadRef.current = tusUploader.abort;
      await tusUploader.start();
      cancelUploadRef.current = null;
    } catch (err: any) {
      if (err?.message !== "Compression cancelled." && err?.message !== "Upload cancelled by user.") {
        setProcessingStage("error");
        setErrorMessage(err.message || "Video processing encountered an error.");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetVideoWorkflow();
    setPreview(null);
    onImageChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInputValue.trim();
    if (trimmed) {
      setPreview(trimmed);
      onImageChange(trimmed);
      setUrlInputValue("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className="adm-form-group">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <label className="adm-form-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: "none",
            border: "none",
            color: "var(--adm-primary)",
            fontSize: "0.76rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: 0,
          }}
        >
          <LinkIcon size={12} />
          <span>{showUrlInput ? "Upload File" : "Paste Media URL"}</span>
        </button>
      </div>

      {showUrlInput && (
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <input
            type="url"
            className="adm-input"
            placeholder={allowVideo ? "https://example.com/video.mp4" : "https://example.com/image.png"}
            value={urlInputValue}
            onChange={(e) => setUrlInputValue(e.target.value)}
            style={{ fontSize: "0.82rem" }}
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="adm-btn adm-btn-primary"
            style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", flexShrink: 0 }}
          >
            Apply
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIDEO WORKFLOW PANEL: Configuration, Progress & Compression Stats          */}
      {/* ========================================================================= */}
      {pendingVideoFile && processingStage !== "idle" && (
        <div className="adm-video-workflow-card">
          {/* Header & Video Specs */}
          <div className="adm-video-specs-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div className="adm-video-icon-pill">
                <VideoIcon size={16} />
              </div>
              <div>
                <div className="adm-video-filename" title={pendingVideoFile.name}>
                  {pendingVideoFile.name}
                </div>
                <div className="adm-video-badges-row">
                  <span className="adm-badge adm-badge-original">
                    Original: {(pendingVideoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                  {videoMetadata && (
                    <>
                      <span className="adm-badge adm-badge-resolution">
                        {videoMetadata.width} × {videoMetadata.height} ({videoMetadata.aspectRatio})
                      </span>
                      <span className="adm-badge adm-badge-duration">
                        {videoMetadata.durationFormatted}
                      </span>
                      {videoMetadata.isPortrait && (
                        <span className="adm-badge adm-badge-portrait">9:16 Reel</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetVideoWorkflow}
              className="adm-icon-btn danger"
              title="Cancel and remove"
            >
              <X size={15} />
            </button>
          </div>

          {/* Mobile Resource Advisory Warning */}
          {mobileCheck?.isLargeForDevice && processingStage === "ready" && (
            <div className="adm-mobile-warning-box">
              <AlertTriangle size={16} className="adm-warning-icon" />
              <div>
                <div style={{ fontWeight: 600, color: "var(--adm-warning)" }}>Mobile Resource Alert</div>
                <div style={{ fontSize: "0.76rem", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                  {mobileCheck.warningMessage}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 1: Ready to Compress — Quality Selection & Trigger */}
          {processingStage === "ready" && (
            <div className="adm-video-options-panel">
              <div className="adm-quality-control-block">
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600 }}>
                  <Sliders size={14} style={{ color: "var(--adm-primary)" }} />
                  <span>Compression Quality (H.264 / AAC):</span>
                </div>

                <div className="adm-quality-selector-grid">
                  <button
                    type="button"
                    className={`adm-quality-option ${crfQuality === 20 ? "is-selected" : ""}`}
                    onClick={() => setCrfQuality(20)}
                  >
                    <span className="quality-title">High Quality</span>
                    <span className="quality-desc">CRF 20 (~55% reduction)</span>
                  </button>

                  <button
                    type="button"
                    className={`adm-quality-option ${crfQuality === 23 ? "is-selected" : ""}`}
                    onClick={() => setCrfQuality(23)}
                  >
                    <span className="quality-title">Balanced (Recommended)</span>
                    <span className="quality-desc">CRF 23 (~75% reduction)</span>
                  </button>

                  <button
                    type="button"
                    className={`adm-quality-option ${crfQuality === 25 ? "is-selected" : ""}`}
                    onClick={() => setCrfQuality(25)}
                  >
                    <span className="quality-title">Maximum Savings</span>
                    <span className="quality-desc">CRF 25 (~85% reduction)</span>
                  </button>
                </div>
              </div>

              <div className="adm-video-actions-row">
                {mobileCheck?.isLargeForDevice ? (
                  <>
                    <button
                      type="button"
                      onClick={() => startCompressionAndUpload(true)}
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Direct Upload (Skip Compression)
                    </button>
                    <button
                      type="button"
                      onClick={() => startCompressionAndUpload(false)}
                      className="adm-btn adm-btn-primary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Zap size={14} />
                      <span>Compress &amp; Upload</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={resetVideoWorkflow}
                      className="adm-btn adm-btn-secondary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => startCompressionAndUpload(false)}
                      className="adm-btn adm-btn-primary"
                      style={{ fontSize: "0.8rem" }}
                    >
                      <Sparkles size={14} />
                      <span>Start Compression &amp; Upload</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STAGE 2: Compressing Progress Bar */}
          {processingStage === "compressing" && (
            <div className="adm-video-progress-panel">
              <div className="adm-progress-top">
                <span className="adm-progress-label">
                  <Loader2 size={13} className="adm-spin" style={{ color: "var(--adm-primary)" }} />
                  <span>{compressionProgress?.message || "Compressing video in browser..."}</span>
                </span>
                <span className="adm-progress-percent">
                  {compressionProgress?.percent || 0}%
                </span>
              </div>

              <div className="adm-progress-track">
                <div
                  className="adm-progress-fill"
                  style={{ width: `${compressionProgress?.percent || 0}%` }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                  {compressionProgress?.etaSeconds ? `Estimated remaining: ~${compressionProgress.etaSeconds}s` : "Encoding H.264 / AAC + faststart..."}
                </span>
                <button
                  type="button"
                  onClick={() => cancelCompressionRef.current?.()}
                  className="adm-btn adm-btn-danger adm-btn-sm"
                >
                  Cancel Compression
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: TUS Resumable Upload Progress Bar */}
          {processingStage === "uploading" && (
            <div className="adm-video-progress-panel">
              <div className="adm-progress-top">
                <span className="adm-progress-label">
                  <UploadCloud size={14} style={{ color: "var(--adm-success)" }} />
                  <span>Uploading to Supabase Storage (6MB chunks)...</span>
                </span>
                <span className="adm-progress-percent" style={{ color: "var(--adm-success)" }}>
                  {uploadPercent}%
                </span>
              </div>

              <div className="adm-progress-track">
                <div
                  className="adm-progress-fill is-uploading"
                  style={{ width: `${uploadPercent}%` }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--adm-text-muted)" }}>
                  {uploadBytesInfo
                    ? `${(uploadBytesInfo.uploaded / (1024 * 1024)).toFixed(1)} MB / ${(uploadBytesInfo.total / (1024 * 1024)).toFixed(1)} MB`
                    : "Sending chunks..."}
                </span>
                <button
                  type="button"
                  onClick={() => cancelUploadRef.current?.()}
                  className="adm-btn adm-btn-danger adm-btn-sm"
                >
                  Cancel Upload
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: Completed Compression & Upload Success Banner */}
          {processingStage === "completed" && compressionResult && (
            <div className="adm-video-completed-banner">
              <CheckCircle2 size={18} style={{ color: "var(--adm-success)", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "0.82rem" }}>
                  Optimized &amp; Uploaded to Supabase!
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--adm-text-secondary)", marginTop: "2px" }}>
                  {compressionResult.isFallbackOriginal ? (
                    <span>Original was already optimal: {(compressionResult.originalSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                  ) : (
                    <span>
                      {(compressionResult.originalSizeBytes / (1024 * 1024)).toFixed(1)} MB →{" "}
                      <strong>{(compressionResult.compressedSizeBytes / (1024 * 1024)).toFixed(1)} MB</strong>{" "}
                      <span className="adm-savings-pill">-{compressionResult.reductionPercentage}% saved</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Banner with Direct Upload Fallback */}
          {processingStage === "error" && errorMessage && (
            <div className="adm-video-error-box" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", width: "100%" }}>
                <AlertTriangle size={18} style={{ color: "var(--adm-danger)", flexShrink: 0, marginTop: "2px" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--adm-danger)", fontSize: "0.82rem" }}>
                    Video Processing Notice
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--adm-text-secondary)", marginTop: "2px", wordBreak: "break-word" }}>
                    {errorMessage}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem", flexWrap: "wrap", width: "100%", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => startCompressionAndUpload(true)}
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  title="Upload original video directly to Supabase via TUS"
                >
                  <UploadCloud size={13} />
                  <span>Direct Upload (Skip Compression)</span>
                </button>
                <button
                  type="button"
                  onClick={() => startCompressionAndUpload(false)}
                  className="adm-btn adm-btn-secondary adm-btn-sm"
                >
                  <RotateCcw size={13} />
                  <span>Retry Compression</span>
                </button>
                <button
                  type="button"
                  onClick={resetVideoWorkflow}
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STANDARD MEDIA PREVIEW OR DROPZONE                                       */}
      {/* ========================================================================= */}
      {preview ? (
        <div className="adm-image-preview-box" style={{ position: "relative", backgroundColor: "#000000", minHeight: "140px" }}>
          {isVideoSource(preview) ? (
            <video
              src={preview}
              controls
              playsInline
              style={{ maxHeight: "190px", maxWidth: "100%", objectFit: "contain", borderRadius: "var(--adm-radius-md)" }}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={preview} alt="Upload preview" style={{ maxHeight: "140px", objectFit: "contain" }} />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="adm-icon-btn danger"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              backgroundColor: "rgba(13, 13, 18, 0.85)",
              backdropFilter: "blur(4px)",
              zIndex: 10,
            }}
            title="Remove media"
          >
            <X size={14} />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: "6px",
              left: "8px",
              fontSize: "0.7rem",
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              backgroundColor: preview.startsWith("http") ? "rgba(16, 185, 129, 0.2)" : "rgba(139, 61, 255, 0.2)",
              color: preview.startsWith("http") ? "#34D399" : "var(--adm-primary)",
              border: `1px solid ${preview.startsWith("http") ? "rgba(16, 185, 129, 0.3)" : "rgba(139, 61, 255, 0.3)"}`,
              zIndex: 10,
            }}
          >
            {isVideoSource(preview)
              ? (preview.startsWith("http") ? "Compressed MP4 (Supabase Cloud)" : "Video File Loaded")
              : (preview.startsWith("http") ? "Cloud URL" : "Optimized Asset (< 40KB)")}
          </div>
        </div>
      ) : !pendingVideoFile ? (
        <div
          className="adm-upload-dropzone"
          style={isDragging ? { borderColor: "var(--adm-primary)", backgroundColor: "var(--adm-primary-subtle)" } : {}}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept={allowVideo ? "image/*,video/*,.mp4,.webm,.mov,.m4v,.ogg,.svg" : "image/*,.svg"}
            style={{ display: "none" }}
          />
          <div className="adm-upload-icon">
            {allowVideo ? <VideoIcon size={20} /> : <UploadCloud size={20} />}
          </div>
          <div>
            <div className="adm-upload-text">
              {allowVideo ? "Click to upload video (MP4, MOV) or graphic, or drag & drop" : "Click to upload or drag & drop"}
            </div>
            <div className="adm-upload-hint">
              {allowVideo ? "Videos are automatically compressed via FFmpeg & uploaded via TUS" : helperText}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
