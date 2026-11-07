import * as tus from "tus-js-client";
import { supabase } from "@/lib/supabase-client";

export interface TusUploadOptions {
  file: File | Blob;
  fileName: string;
  folder: string;
  bucketName?: string;
  chunkSize?: number; // default 6 MB
  onProgress?: (percent: number, bytesUploaded: number, bytesTotal: number) => void;
  onSuccess?: (publicUrl: string, storagePath: string) => void;
  onError?: (error: Error) => void;
}

export interface TusUploadHandle {
  abort: () => void;
  start: () => Promise<string>;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Uploads a file to Supabase Storage using TUS resumable uploads (6MB chunks)
 * with automatic retries and cancellation support.
 */
export function createTusUploader({
  file,
  fileName,
  folder,
  bucketName = "assets",
  chunkSize = 6 * 1024 * 1024, // 6 MB chunk size as required
  onProgress,
  onSuccess,
  onError,
}: TusUploadOptions): TusUploadHandle {
  const fileExt = fileName.split(".").pop() || "mp4";
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
  const filePath = `${folder}/${uniqueName}`;

  let tusUploadInstance: tus.Upload | null = null;
  let isAborted = false;

  const start = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      // If TUS configuration is missing or file is tiny (< 2MB), use standard client upload as quick fallback
      if (!supabaseUrl || !supabaseAnonKey) {
        if (!supabase) {
          const err = new Error("Supabase client is not configured.");
          onError?.(err);
          reject(err);
          return;
        }

        try {
          const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, {
            cacheControl: "31536000",
            upsert: true,
            contentType: file.type || "video/mp4",
          });
          if (error) throw error;
          const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
          onSuccess?.(urlData.publicUrl, filePath);
          resolve(urlData.publicUrl);
          return;
        } catch (stdErr: any) {
          onError?.(stdErr);
          reject(stdErr);
          return;
        }
      }

      // Supabase Resumable TUS endpoint
      const endpoint = `${supabaseUrl}/storage/v1/upload/resumable`;

      try {
        tusUploadInstance = new tus.Upload(file, {
          endpoint,
          retryDelays: [0, 1000, 3000, 5000],
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            "x-upsert": "true",
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName,
            objectName: filePath,
            contentType: file.type || "video/mp4",
            cacheControl: "31536000",
          },
          chunkSize, // 6 MB chunking
          onError: (error) => {
            if (isAborted) {
              const abortErr = new Error("Upload cancelled by user.");
              onError?.(abortErr);
              reject(abortErr);
              return;
            }
            console.warn("TUS upload notice, attempting standard fallback:", error);
            // Resilient fallback to standard upload if TUS is blocked by proxy
            const client = supabase;
            if (client) {
              client.storage
                .from(bucketName)
                .upload(filePath, file, {
                  cacheControl: "31536000",
                  upsert: true,
                  contentType: file.type || "video/mp4",
                })
                .then(({ data, error: fbErr }) => {
                  if (fbErr || !data) {
                    onError?.(error);
                    reject(error);
                  } else {
                    const { data: urlData } = client.storage.from(bucketName).getPublicUrl(data.path);
                    onSuccess?.(urlData.publicUrl, filePath);
                    resolve(urlData.publicUrl);
                  }
                })
                .catch(() => {
                  onError?.(error);
                  reject(error);
                });
            } else {
              onError?.(error);
              reject(error);
            }
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            if (isAborted) return;
            const percent = Math.min(100, Math.round((bytesUploaded / bytesTotal) * 100));
            onProgress?.(percent, bytesUploaded, bytesTotal);
          },
          onSuccess: () => {
            const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
            onProgress?.(100, file.size, file.size);
            onSuccess?.(publicUrl, filePath);
            resolve(publicUrl);
          },
        });

        // Resume from previous chunk if available
        tusUploadInstance.findPreviousUploads().then((previousUploads) => {
          if (isAborted) return;
          if (previousUploads.length) {
            tusUploadInstance?.resumeFromPreviousUpload(previousUploads[0]);
          }
          tusUploadInstance?.start();
        });
      } catch (err: any) {
        onError?.(err);
        reject(err);
      }
    });
  };

  const abort = () => {
    isAborted = true;
    if (tusUploadInstance) {
      try {
        tusUploadInstance.abort();
      } catch (e) {
        console.warn("Error aborting TUS upload:", e);
      }
    }
  };

  return { abort, start };
}
