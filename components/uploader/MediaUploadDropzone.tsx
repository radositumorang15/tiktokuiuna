"use client";

import React, { useRef, useState } from "react";

interface MediaUploadDropzoneProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  label?: string;
  hint?: string;
  icon?: string;
  disabled?: boolean;
  className?: string;
}

export function MediaUploadDropzone({
  accept,
  multiple = false,
  onFilesSelected,
  isUploading = false,
  uploadProgress,
  label = "Tarik & Lepas File di Sini",
  hint = "Atau klik untuk memilih file dari komputer",
  icon = "📁",
  disabled = false,
  className = "",
}: MediaUploadDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
      e.target.value = ""; // Reset to allow re-uploading same file name
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && !isUploading) inputRef.current?.click();
      }}
      className={`relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
        isDragOver
          ? "border-primary bg-primary/10 scale-[1.01]"
          : "border-[#3a3a3a] bg-[#161823] hover:border-[#666666] hover:bg-[#1a1c29]"
      } ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {isUploading ? (
        <div className="flex flex-col items-center space-y-2 py-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-semibold text-white">
            Mengunggah media...
          </span>
          {uploadProgress !== undefined && (
            <span className="text-[11px] text-[#a8a8a8]">
              {Math.round(uploadProgress)}%
            </span>
          )}
        </div>
      ) : (
        <>
          <span className="text-[32px] mb-2">{icon}</span>
          <p className="text-[14px] font-semibold text-white">{label}</p>
          <p className="text-[12px] text-[#a8a8a8] mt-1">{hint}</p>
          <span className="mt-2 text-[11px] px-2.5 py-0.5 rounded-full bg-[#1f1f1f] text-[#737373] border border-[#3a3a3a]">
            {accept}
          </span>
        </>
      )}
    </div>
  );
}

