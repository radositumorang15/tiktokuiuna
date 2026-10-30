"use client";

import React, { useState, useEffect } from "react";

interface VoiceNoteEffectProps {
  payload?: {
    text?: string;
  };
  onClose: () => void;
}

export function VoiceNoteEffect({ payload, onClose }: VoiceNoteEffectProps) {
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      className="fixed left-4 right-4 z-50 flex justify-center pointer-events-auto"
      style={{ bottom: "calc(130px + env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#161823] border border-[#3a3a3a] shadow-2xl max-w-[340px] w-full animate-in slide-in-from-bottom-4 duration-300">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? "Jeda pesan suara" : "Putar pesan suara"}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white shrink-0 active:scale-95"
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Audio Waveform visualization */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-1 h-6">
            {[12, 24, 16, 28, 14, 20, 26, 18, 22, 14, 26, 18, 12].map((height, i) => (
              <div
                key={i}
                style={{
                  height: `${isPlaying ? height : 6}px`,
                  transition: "height 0.2s ease",
                }}
                className="flex-1 bg-white/70 rounded-full"
              />
            ))}
          </div>
          {payload?.text && (
            <span className="text-[11px] text-[#a8a8a8] truncate mt-0.5 max-w-[200px]">
              {payload.text}
            </span>
          )}
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pesan suara"
          className="text-white/60 hover:text-white text-[14px] p-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
