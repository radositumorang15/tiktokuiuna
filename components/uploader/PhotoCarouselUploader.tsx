"use client";

import React, { useState } from "react";
import { MediaUploadDropzone } from "./MediaUploadDropzone";

export interface CarouselPhoto {
  src: string;
  caption?: string;
}

interface PhotoCarouselUploaderProps {
  photos?: CarouselPhoto[];
  onChange: (photos: CarouselPhoto[]) => void;
}

export function PhotoCarouselUploader({
  photos = [],
  onChange,
}: PhotoCarouselUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-photo upload handler
  const handlePhotosSelect = async (files: File[]) => {
    if (!files.length) return;

    // Check size first
    const maxPhotoSize = 25 * 1024 * 1024;
    for (const f of files) {
      if (f.size > maxPhotoSize) {
        setErrorMessage(
          `Foto "${f.name}" terlalu besar (${(f.size / (1024 * 1024)).toFixed(1)} MB). Maksimal ukuran per foto adalah 25 MB.`
        );
        return;
      }
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const uploadedPhotos: CarouselPhoto[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "photos");

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Gagal mengunggah ${file.name}`);
        }

        uploadedPhotos.push({
          src: data.url,
          caption: "",
        });
      }

      onChange([...photos, ...uploadedPhotos]);
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "Gagal mengunggah foto";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        msg =
          "Koneksi ke server terputus (Failed to fetch). Silakan coba klik dan unggah kembali foto Anda.";
      }
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Reordering helpers
  const movePhoto = (index: number, direction: "prev" | "next") => {
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const updated = [...photos];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updatePhotoCaption = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
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

      {/* Upload Dropzone */}
      <MediaUploadDropzone
        accept="image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.heic,.heif"
        multiple
        onFilesSelected={handlePhotosSelect}
        isUploading={isUploading}
        label="Unggah Foto Carousel (Pilih Banyak Foto)"
        hint="Pilih 3–20 foto romantis kalian (.jpg, .png, .webp, .heic). Rasio portrait disarankan"
        icon="📸"
      />

      {/* Uploaded Photos Grid & Management */}
      {photos.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-white">
              Daftar Foto Carousel ({photos.length} foto)
            </span>
            <span className="text-[11px] text-[#a8a8a8]">
              Gunakan tombol panah untuk mengubah urutan tayang
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map((photo, idx) => (
              <div
                key={`${photo.src}-${idx}`}
                className="p-3 rounded-xl bg-[#161823] border border-[#3a3a3a] flex flex-col justify-between space-y-2 group"
              >
                {/* Photo preview with index badge */}
                <div className="relative w-full aspect-[9/12] rounded-lg overflow-hidden bg-black border border-[#2a2a2a]">
                  <img
                    src={photo.src}
                    alt={`Foto ${idx + 1}`}
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      // Fallback visual if image fails to render
                      (e.target as HTMLElement).style.display = "none";
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector(".img-error-badge")) {
                        const fallback = document.createElement("div");
                        fallback.className =
                          "img-error-badge w-full h-full flex flex-col items-center justify-center p-2 text-center text-red-400 text-[11px] bg-[#1a1111]";
                        fallback.innerHTML = "<span>⚠️ Gagal memuat foto</span>";
                        parent.appendChild(fallback);
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[11px] font-bold text-white">
                    #{idx + 1}
                  </span>

                  {idx === 0 && (
                    <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary text-[10px] font-bold text-white">
                      Cover
                    </span>
                  )}
                </div>

                {/* Per-photo caption input */}
                <div>
                  <label className="text-[10px] text-[#a8a8a8] block mb-1">
                    Caption Foto #{idx + 1} (Opsional)
                  </label>
                  <input
                    type="text"
                    value={photo.caption || ""}
                    placeholder="Tulis momen foto ini..."
                    onChange={(e) => updatePhotoCaption(idx, e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-[#1f1f1f] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Reorder and Delete controls */}
                <div className="flex items-center justify-between pt-1 border-t border-[#2a2a2a]">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => movePhoto(idx, "prev")}
                      className="px-2 py-1 rounded bg-[#1f1f1f] text-[11px] font-bold text-white hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Geser ke kiri"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      disabled={idx === photos.length - 1}
                      onClick={() => movePhoto(idx, "next")}
                      className="px-2 py-1 rounded bg-[#1f1f1f] text-[11px] font-bold text-white hover:bg-[#333333] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Geser ke kanan"
                    >
                      →
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="px-2 py-1 rounded bg-red-950/40 text-[11px] font-bold text-red-400 hover:bg-red-900/60"
                    title="Hapus foto ini"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
