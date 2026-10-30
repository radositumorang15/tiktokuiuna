"use client";

import React, { useState, useRef } from "react";
import { MediaUploadDropzone } from "./MediaUploadDropzone";

interface AudioUploaderProps {
  audioSrc?: string;
  songTitle: string;
  songArtist: string;
  songCover: string;
  isVideo?: boolean;
  onAudioChange: (audioUrl: string) => void;
  onSongInfoChange: (fields: { title?: string; artist?: string; cover?: string }) => void;
}

export function AudioUploader({
  audioSrc,
  songTitle,
  songArtist,
  songCover,
  isVideo = false,
  onAudioChange,
  onSongInfoChange,
}: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Audio file upload
  const handleAudioSelect = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "audio");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah file musik");
      }

      onAudioChange(data.url);

      // Auto-populate song title from file name if current title is default
      const rawName = file.name.replace(/\.[^/.]+$/, "");
      if (!songTitle || songTitle.startsWith("Suara asli") || songTitle.includes("Akustik Santai")) {
        onSongInfoChange({ title: rawName });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengunggah audio";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  // Cover image upload for song disc
  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onSongInfoChange({ cover: data.url });
      }
    } catch (err) {
      console.error("Cover upload error:", err);
    }
  };

  return (
    <div className="space-y-3 p-4 rounded-xl bg-[#161823] border border-[#2a2a2a]">
      {/* Audio Source Status Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <span className="text-[16px]">🎵</span>
          <span className="text-[12px] font-bold text-white uppercase tracking-wider">
            Pengaturan Sound / Musik
          </span>
        </div>

        {isVideo && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
              audioSrc
                ? "bg-primary/20 text-primary border border-primary/40"
                : "bg-green-950 text-green-400 border border-green-800"
            }`}
          >
            {audioSrc ? "Lagu Kustom" : "Suara Asli Video (Otomatis)"}
          </span>
        )}
      </div>

      {errorMessage && (
        <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-500/50 text-red-200 text-[11px]">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Explanatory Note for Video vs Custom Audio */}
      {isVideo && (
        <p className="text-[11px] text-[#a8a8a8] leading-relaxed">
          {audioSrc ? (
            <>
              ✨ <strong className="text-white">Lagu kustom aktif:</strong> Musik di bawah ini akan
              diputar sebagai backsound, dan audio asli video otomatis dibisukan agar tidak bertabrakan.
            </>
          ) : (
            <>
              🔊 <strong className="text-white">Suara video aktif:</strong> Karena tidak ada lagu kustom,
              suara asli dari video otomatis menjadi musiknya di feed & disc berputar.
            </>
          )}
        </p>
      )}

      {/* Audio Player or Upload Dropzone */}
      {audioSrc ? (
        <div className="p-3 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white truncate max-w-[240px]">
              🎶 {audioSrc.split("/").pop()}
            </span>
            <button
              type="button"
              onClick={() => onAudioChange("")}
              className="text-[11px] text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              {isVideo ? "Gunakan Suara Video Saja" : "Hapus Lagu"}
            </button>
          </div>

          <audio src={audioSrc} controls className="w-full h-8" />
        </div>
      ) : (
        <MediaUploadDropzone
          accept="audio/mpeg,audio/mp4,audio/wav,audio/aac,audio/ogg,.mp3,.m4a,.wav,.aac"
          onFilesSelected={handleAudioSelect}
          isUploading={isUploading}
          label={
            isVideo
              ? "Unggah Lagu Kustom (.mp3 / .m4a / .wav)"
              : "Unggah Lagu Pengiring Foto Carousel (.mp3)"
          }
          hint={
            isVideo
              ? "Opsional. Jika kosong, otomatis suara asli video yang diputar."
              : "Pilih lagu romantis kalian untuk mengiringi foto carousel."
          }
          icon="🎶"
          className="py-4"
        />
      )}

      {/* Song Metadata Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-[#2a2a2a] items-start">
        {/* Cover Disc Image */}
        <div className="sm:col-span-3 flex flex-col items-center">
          <label className="text-[10px] text-[#a8a8a8] block mb-1">Cover Disc</label>
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-black border border-[#3a3a3a] group cursor-pointer">
            <img
              src={songCover || "/covers/song-1.jpg"}
              alt="Cover disc"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-bold transition-opacity"
            >
              Ganti
            </button>
          </div>
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverSelect}
            className="hidden"
          />
        </div>

        {/* Title & Artist */}
        <div className="sm:col-span-9 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-[#a8a8a8] block mb-1">Judul Lagu</label>
            <input
              type="text"
              value={songTitle}
              onChange={(e) => onSongInfoChange({ title: e.target.value })}
              placeholder={isVideo && !audioSrc ? "Suara asli - Rado & Una" : "Judul lagu..."}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-[10px] text-[#a8a8a8] block mb-1">Penyanyi / Artis</label>
            <input
              type="text"
              value={songArtist}
              onChange={(e) => onSongInfoChange({ artist: e.target.value })}
              placeholder="Nama artis..."
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

