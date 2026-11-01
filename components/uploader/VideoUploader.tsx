"use client";

import React, { useState, useRef } from "react";
import { MediaUploadDropzone } from "./MediaUploadDropzone";

interface VideoUploaderProps {
  videoSrc?: string;
  posterSrc?: string;
  onChange: (videoSrc: string, posterSrc: string) => void;
}

export function VideoUploader({
  videoSrc,
  posterSrc,
  onChange,
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadStats, setUploadStats] = useState<{
    size: number;
    originalSize?: number;
    isCompressed?: boolean;
  } | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);

  // Upload video file
  const handleVideoSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    // Client-side pre-validation: check size before making request
    const maxSize = 250 * 1024 * 1024; // 250 MB
    if (file.size > maxSize) {
      setErrorMessage(
        `Ukuran video terlalu besar (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maksimal ukuran file adalah 250 MB.`
      );
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "videos");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah video ke server");
      }

      if (data.size) {
        setUploadStats({
          size: data.size,
          originalSize: data.originalSize,
          isCompressed: data.isCompressed,
        });
      }

      const uploadedUrl = data.url;

      // Auto-generate poster from video first frame
      try {
        const autoPoster = await generatePosterFromVideoUrl(uploadedUrl);
        onChange(uploadedUrl, autoPoster || posterSrc || "");
      } catch {
        onChange(uploadedUrl, posterSrc || "");
      }
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Gagal mengunggah video";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        msg =
          "Koneksi terputus ke server saat mengunggah (Failed to fetch). Ini biasanya terjadi sesaat ketika server Next.js sedang merefresh modul atau file terlalu besar. Silakan coba klik dan unggah kembali video Anda.";
      }
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Helper: capture frame from video URL
  const generatePosterFromVideoUrl = (url: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.crossOrigin = "anonymous";
      video.src = url;
      video.muted = true;
      video.currentTime = 0.5;

      video.onloadeddata = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 720;
          canvas.height = video.videoHeight || 1280;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve("");

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(async (blob) => {
            if (!blob) return resolve("");
            const formData = new FormData();
            formData.append("file", blob, "poster.jpg");
            formData.append("category", "posters");

            const res = await fetch("/api/upload", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.success && data.url) {
              resolve(data.url);
            } else {
              resolve("");
            }
          }, "image/jpeg", 0.85);
        } catch {
          resolve("");
        }
      };

      video.onerror = () => resolve("");
      setTimeout(() => resolve(""), 5000); // 5s timeout
    });
  };

  // Manual poster upload
  const handleCustomPosterSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "posters");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onChange(videoSrc || "", data.url);
      }
    } catch (err: unknown) {
      console.error("Poster upload failed:", err);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-[12px] flex items-start justify-between gap-2">
          <span>⚠️ {errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {videoSrc ? (
        <div className="p-4 rounded-xl bg-[#161823] border border-[#3a3a3a] space-y-3">
          <div className="flex items-start gap-4">
            {/* Video preview thumbnail */}
            <div className="w-[120px] h-[190px] rounded-lg overflow-hidden bg-black border border-[#3a3a3a] shrink-0 relative group">
              <video
                ref={videoPreviewRef}
                src={videoSrc}
                poster={posterSrc}
                controls
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video info & controls */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-green-950 text-green-400 border border-green-800">
                  Video Aktif
                </span>
                <span className="text-[12px] text-[#a8a8a8] font-mono truncate max-w-[200px]">
                  {videoSrc.split("/").pop()}
                </span>
              </div>

              <p className="text-[12px] text-[#a8a8a8]">
                Video siap tayang di feed (rasio vertikal 9:16).
              </p>

              {uploadStats ? (
                <div className="text-[11px] text-green-400 bg-green-950/40 border border-green-800/60 rounded px-2.5 py-1.5 flex flex-col gap-0.5">
                  <div className="flex items-center gap-1 font-semibold">
                    <span>⚡ Terkompresi Otomatis (1080p HD Lossless)</span>
                  </div>
                  <div className="text-white/70 text-[11px]">
                    Ukuran: {(uploadStats.size / (1024 * 1024)).toFixed(1)} MB
                    {uploadStats.originalSize && uploadStats.originalSize > uploadStats.size && (
                      <span className="text-green-300 font-semibold">
                        {" "}(hemat {Math.round((1 - uploadStats.size / uploadStats.originalSize) * 100)}% dari {(uploadStats.originalSize / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[#25f4ee] bg-[#25f4ee]/10 border border-[#25f4ee]/30 rounded px-2.5 py-1 flex items-center gap-1">
                  <span>⚡ Siap streaming lancar (H.264 FastStart 1080p)</span>
                </div>
              )}

              {/* Poster info */}
              <div className="pt-2 border-t border-[#3a3a3a] flex items-center gap-3">
                {posterSrc ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={posterSrc}
                      alt="Poster thumbnail"
                      className="w-8 h-12 object-cover rounded border border-[#3a3a3a]"
                    />
                    <span className="text-[11px] text-[#a8a8a8]">Poster terpasang</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#737373]">Belum ada poster</span>
                )}

                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomPosterSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => posterInputRef.current?.click()}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Ganti Poster Gambar
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onChange("", "")}
                  className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-[12px] font-semibold hover:bg-red-900/50 transition-colors"
                >
                  Hapus Video
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <MediaUploadDropzone
          accept="video/mp4,video/webm,video/quicktime,.mp4,.mov,.webm"
          onFilesSelected={handleVideoSelect}
          isUploading={isUploading}
          label={isUploading ? "Mengunggah & Mengompres Otomatis..." : "Unggah Video Klip (.mp4 / .mov / .webm)"}
          hint="Rasio vertikal 9:16 disarankan, maksimal 250 MB (otomatis dikompresi kualitas jernih)"
          icon="🎬"
        />
      )}
    </div>
  );
}
