"use client";

import React, { useState } from "react";

interface ProgressBarProps {
  progress: number; // 0 to 1
  totalSegments?: number; // for photos
  currentSegment?: number; // for photos
  segmentProgress?: number; // 0 to 1 progress of current photo
  onSeek?: (ratio: number) => void;
}

export function ProgressBar({
  progress,
  totalSegments,
  currentSegment = 0,
  segmentProgress,
  onSeek,
}: ProgressBarProps) {
  const [isPressing, setIsPressing] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsPressing(true);
    handleSeek(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPressing) {
      handleSeek(e);
    }
  };

  const handlePointerUp = () => {
    setIsPressing(false);
  };

  const handleSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    onSeek(ratio);
  };

  const activeSegmentFill =
    segmentProgress !== undefined ? segmentProgress : progress;

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      aria-label="Progress bar"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="absolute left-0 right-0 z-30 flex items-center cursor-pointer select-none py-2"
      style={{
        bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {totalSegments && totalSegments > 1 ? (
        /* TikTok-style Photo Segmented Story Progress Bar */
        <div className="w-full flex items-center gap-1.5 px-3">
          {Array.from({ length: totalSegments }).map((_, idx) => (
            <div
              key={idx}
              className={`relative flex-1 ${
                isPressing ? "h-[5px]" : "h-[2px]"
              } rounded-full bg-white/25 overflow-hidden transition-all duration-150`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-white"
                style={{
                  width:
                    idx < currentSegment
                      ? "100%"
                      : idx === currentSegment
                      ? `${Math.min(100, Math.max(0, activeSegmentFill * 100))}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Continuous video progress track (2px grows to 6px) */
        <div
          className={`w-full relative transition-all duration-150 ${
            isPressing ? "h-[6px]" : "h-[2px]"
          } bg-white/30`}
        >
          <div
            className="absolute top-0 bottom-0 left-0 bg-white"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
      )}
    </div>
  );
}
