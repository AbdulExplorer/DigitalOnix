import {
  VideoMetadata,
  CompressionSettings,
  CompressionProgress,
  CompressionResult,
} from "./video-types";

// Dynamic CDN endpoints for single-threaded FFmpeg.wasm core (zero COOP/COEP isolation conflicts)
const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.10/dist/esm";

// Single-concurrency lock
let isGlobalEncodingActive = false;
let activeFFmpegInstance: any = null;
let activeAbortController: AbortController | null = null;

/**
 * Extracts video metadata using a lightweight browser DOM video probe
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const width = video.videoWidth || 1920;
      const height = video.videoHeight || 1080;
      const durationSeconds = video.duration && !isNaN(video.duration) ? video.duration : 0;
      const isPortrait = height > width;

      // Aspect ratio calculation
      let aspectRatio = "16/9";
      if (width > 0 && height > 0) {
        const ratio = width / height;
        if (Math.abs(ratio - 16 / 9) < 0.1) aspectRatio = "16/9";
        else if (Math.abs(ratio - 9 / 16) < 0.1) aspectRatio = "9/16";
        else if (Math.abs(ratio - 1) < 0.1) aspectRatio = "1/1";
        else if (Math.abs(ratio - 4 / 5) < 0.1) aspectRatio = "4/5";
        else aspectRatio = `${width}:${height}`;
      }

      // Format mm:ss
      const mins = Math.floor(durationSeconds / 60);
      const secs = Math.round(durationSeconds % 60);
      const durationFormatted = `${mins}:${secs.toString().padStart(2, "0")}`;

      // Check audio track presence if supported
      let hasAudio = true;
      try {
        if ("captureStream" in video || "mozCaptureStream" in video) {
          const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
          hasAudio = stream.getAudioTracks().length > 0;
        }
      } catch {
        hasAudio = true;
      }

      cleanup();
      resolve({
        filename: file.name,
        sizeBytes: file.size,
        sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
        durationSeconds,
        durationFormatted,
        width,
        height,
        aspectRatio,
        isPortrait,
        hasAudio,
      });
    };

    video.onerror = () => {
      cleanup();
      resolve({
        filename: file.name,
        sizeBytes: file.size,
        sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
        durationSeconds: 0,
        durationFormatted: "0:00",
        width: 1920,
        height: 1080,
        aspectRatio: "16/9",
        isPortrait: false,
        hasAudio: true,
      });
    };

    video.src = url;
  });
}

/**
 * Checks device capabilities and evaluates against mobile threshold
 */
export function checkDeviceCapabilities(fileSizeBytes: number, mobileThresholdMB = 75) {
  const isMobile =
    typeof navigator !== "undefined" &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== "undefined" && window.innerWidth < 768 && "ontouchstart" in window));

  const deviceMemoryGB = typeof navigator !== "undefined" ? (navigator as any).deviceMemory : undefined;
  const hardwareConcurrency = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : undefined;

  const fileSizeMB = fileSizeBytes / (1024 * 1024);
  const isLargeForDevice = isMobile && fileSizeMB > mobileThresholdMB;

  let warningMessage: string | undefined;
  if (isLargeForDevice) {
    warningMessage = `This video is ${fileSizeMB.toFixed(1)} MB (exceeds ${mobileThresholdMB} MB mobile threshold). In-browser mobile compression may exceed phone RAM. Desktop compression is recommended.`;
  } else if (deviceMemoryGB && deviceMemoryGB <= 2) {
    warningMessage = `Your device has ~${deviceMemoryGB} GB RAM. Video compression may take longer.`;
  }

  return {
    isMobile,
    deviceMemoryGB,
    hardwareConcurrency,
    mobileThresholdMB,
    isLargeForDevice,
    warningMessage,
  };
}

export interface VideoCompressionJob {
  file: File;
  settings?: Partial<CompressionSettings>;
  metadata?: VideoMetadata;
  onProgress?: (progress: CompressionProgress) => void;
}

export interface CompressionControl {
  promise: Promise<CompressionResult>;
  cancel: () => void;
}

/**
 * Compresses a video using browser-based FFmpeg.wasm with exact production settings
 */
export function startVideoCompression({
  file,
  settings: customSettings,
  metadata: initialMetadata,
  onProgress,
}: VideoCompressionJob): CompressionControl {
  if (isGlobalEncodingActive) {
    throw new Error("Another video is currently being compressed. Please wait until it completes.");
  }

  isGlobalEncodingActive = true;
  activeAbortController = new AbortController();
  const startTime = Date.now();
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    if (activeAbortController) {
      activeAbortController.abort();
    }
    if (activeFFmpegInstance) {
      try {
        activeFFmpegInstance.terminate();
      } catch (e) {
        console.warn("Notice terminating FFmpeg:", e);
      }
      activeFFmpegInstance = null;
    }
    isGlobalEncodingActive = false;
    onProgress?.({
      stage: "cancelled",
      ratio: 0,
      percent: 0,
      elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
      message: "Video compression cancelled by user.",
    });
  };

  const promise = (async (): Promise<CompressionResult> => {
    try {
      const crf = Math.max(20, Math.min(25, customSettings?.crf ?? 23));
      const preset = customSettings?.preset ?? "veryfast";

      // 1. Extract metadata if not already available
      onProgress?.({
        stage: "analyzing",
        ratio: 0.05,
        percent: 5,
        elapsedSeconds: 0,
        message: "Analyzing video streams and dimensions...",
      });

      const meta = initialMetadata || (await extractVideoMetadata(file));
      if (cancelled) throw new Error("Compression cancelled.");

      // Calculate target resolution (capped at 1920x1080, never upscaled, even dimensions)
      let targetW = meta.width;
      let targetH = meta.height;
      const maxW = meta.isPortrait ? 1080 : 1920;
      const maxH = meta.isPortrait ? 1920 : 1080;

      if (targetW > maxW || targetH > maxH) {
        const scale = Math.min(maxW / targetW, maxH / targetH);
        targetW = Math.round((targetW * scale) / 2) * 2;
        targetH = Math.round((targetH * scale) / 2) * 2;
      } else {
        // Ensure even dimensions for yuv420p
        targetW = Math.round(targetW / 2) * 2;
        targetH = Math.round(targetH / 2) * 2;
      }

      // 2. Dynamically import FFmpeg and utilities
      onProgress?.({
        stage: "loading-engine",
        ratio: 0.1,
        percent: 10,
        elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
        message: "Loading browser compression engine...",
      });

      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

      if (cancelled) throw new Error("Compression cancelled.");

      const ffmpeg = new FFmpeg();
      activeFFmpegInstance = ffmpeg;

      // Load core via Blob URLs
      await ffmpeg.load({
        coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
      });

      if (cancelled) throw new Error("Compression cancelled.");

      // 3. Write input file to virtual memory filesystem
      onProgress?.({
        stage: "compressing",
        ratio: 0.15,
        percent: 15,
        elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
        message: "Loading video into memory...",
      });

      const inputName = `input_${Date.now()}.${file.name.split(".").pop() || "mp4"}`;
      const outputName = `output_${Date.now()}.mp4`;

      const inputData = await fetchFile(file);
      await ffmpeg.writeFile(inputName, inputData);

      if (cancelled) throw new Error("Compression cancelled.");

      // Setup real-time progress tracking
      ffmpeg.on("progress", ({ progress, time }) => {
        if (cancelled) return;
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        let calcPercent = 15;

        if (typeof progress === "number" && progress > 0 && progress <= 1) {
          calcPercent = Math.min(98, Math.round(15 + progress * 80));
        } else if (meta.durationSeconds > 0 && time > 0) {
          const currentSecs = time / 1000000;
          const ratio = Math.min(1, currentSecs / meta.durationSeconds);
          calcPercent = Math.min(98, Math.round(15 + ratio * 80));
        }

        const eta =
          calcPercent > 15
            ? Math.round((elapsed / (calcPercent - 15)) * (98 - calcPercent))
            : undefined;

        onProgress?.({
          stage: "compressing",
          ratio: calcPercent / 100,
          percent: calcPercent,
          elapsedSeconds: elapsed,
          etaSeconds: eta,
          message: `Compressing video (H.264 / AAC, CRF ${crf})... ${calcPercent}%`,
        });
      });

      // 4. Build exact FFmpeg execution arguments
      // Scale filter ensuring even dimensions and aspect ratio preservation
      const scaleFilter = `scale=${targetW}:${targetH}`;

      const args = [
        "-i", inputName,
        "-c:v", "libx264",
        "-preset", preset,
        "-crf", crf.toString(),
        "-pix_fmt", "yuv420p",
        "-vf", scaleFilter,
        "-map", "0:v:0",
        "-map", "0:a?", // Optional audio stream mapping: handles silent video gracefully
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart", // Web fast-start streaming
        outputName,
      ];

      // Execute compression
      const exitCode = await ffmpeg.exec(args);

      if (cancelled) throw new Error("Compression cancelled.");

      if (exitCode !== 0) {
        // Fallback execution without audio if audio stream failed
        const fallbackArgs = [
          "-i", inputName,
          "-c:v", "libx264",
          "-preset", preset,
          "-crf", crf.toString(),
          "-pix_fmt", "yuv420p",
          "-vf", scaleFilter,
          "-an", // Strip audio
          "-movflags", "+faststart",
          outputName,
        ];
        const retryCode = await ffmpeg.exec(fallbackArgs);
        if (retryCode !== 0) {
          throw new Error(`FFmpeg encoding exited with code ${retryCode}`);
        }
      }

      onProgress?.({
        stage: "verifying",
        ratio: 0.96,
        percent: 96,
        elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
        message: "Verifying compressed output size...",
      });

      // 5. Read output file from virtual filesystem
      const outputData = await ffmpeg.readFile(outputName);
      const outputBlob = new Blob([outputData as any], { type: "video/mp4" });
      const compressedSizeBytes = outputBlob.size;
      const originalSizeBytes = file.size;

      // 6. Clean up memory
      try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
        ffmpeg.terminate();
      } catch (cleanErr) {
        console.warn("Notice cleaning up FFmpeg files:", cleanErr);
      }
      activeFFmpegInstance = null;

      // 7. Verify optimization: If compressed size >= original, revert to original
      const isFallbackOriginal = compressedSizeBytes >= originalSizeBytes;
      const finalFile = isFallbackOriginal
        ? file
        : new File([outputBlob], file.name.replace(/\.[^/.]+$/, ".mp4"), { type: "video/mp4" });

      const finalSizeBytes = isFallbackOriginal ? originalSizeBytes : compressedSizeBytes;
      const reductionPercentage = Math.max(
        0,
        Math.round(((originalSizeBytes - finalSizeBytes) / originalSizeBytes) * 100)
      );

      onProgress?.({
        stage: "completed",
        ratio: 1,
        percent: 100,
        elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
        message: isFallbackOriginal
          ? "Original file was already highly optimized. Using original file."
          : `Compression complete! Reduced by ${reductionPercentage}% (${(originalSizeBytes / (1024 * 1024)).toFixed(1)}MB → ${(finalSizeBytes / (1024 * 1024)).toFixed(1)}MB).`,
      });

      isGlobalEncodingActive = false;

      return {
        outputBlob: isFallbackOriginal ? file : outputBlob,
        outputFile: finalFile,
        originalSizeBytes,
        compressedSizeBytes: finalSizeBytes,
        reductionPercentage,
        durationFormatted: meta.durationFormatted,
        isFallbackOriginal,
      };
    } catch (err: any) {
      isGlobalEncodingActive = false;
      activeFFmpegInstance = null;
      if (!cancelled) {
        onProgress?.({
          stage: "error",
          ratio: 0,
          percent: 0,
          elapsedSeconds: Math.round((Date.now() - startTime) / 1000),
          message: err?.message || "Video compression failed.",
        });
      }
      throw err;
    }
  })();

  return { promise, cancel };
}

