export interface VideoMetadata {
  filename: string;
  sizeBytes: number;
  sizeMB: number;
  durationSeconds: number;
  durationFormatted: string;
  width: number;
  height: number;
  aspectRatio: string;
  isPortrait: boolean;
  hasAudio: boolean;
}

export interface CompressionSettings {
  crf: number; // 20 to 25 (default 23)
  preset: "ultrafast" | "superfast" | "veryfast" | "faster" | "fast"; // default veryfast
  maxResolution: "1080p" | "720p" | "original";
  mobileThresholdMB: number; // default 75
}

export interface CompressionProgress {
  stage: "idle" | "loading-engine" | "analyzing" | "compressing" | "verifying" | "completed" | "error" | "cancelled";
  ratio: number; // 0 to 1
  percent: number; // 0 to 100
  elapsedSeconds: number;
  etaSeconds?: number;
  message: string;
}

export interface CompressionResult {
  outputBlob: Blob;
  outputFile: File;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  reductionPercentage: number;
  durationFormatted: string;
  isFallbackOriginal: boolean; // true if compressed was larger than original
}

export interface UploadProgress {
  stage: "idle" | "starting" | "uploading" | "completed" | "error" | "cancelled";
  bytesUploaded: number;
  bytesTotal: number;
  percent: number;
  speedMBs?: number;
}

