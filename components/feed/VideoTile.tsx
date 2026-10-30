"use client";

import React, { useRef, useState, useEffect } from "react";
import { type FeedItem } from "@/content/feed";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";

interface VideoTileProps {
  item: FeedItem;
  isActive: boolean;
  onProgress?: (progress: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function VideoTile({
  item,
  isActive,
  onProgress,
  onPlayStateChange,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedSheet, setShowSpeedSheet] = useState(false);

  const muted = useStore((s) => s.muted);
  const addDoubleTapLike = useStore((s) => s.addDoubleTapLike);

  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync play/pause with active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video
        .play()
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange?.(true);
        })
        .catch(() => {
          // Autoplay policy prevented playback, keep muted fallback
          video.muted = true;
          video.play().catch(() => {});
          setIsPlaying(true);
          onPlayStateChange?.(true);
        });
    } else {
      video.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    }
  }, [isActive, onPlayStateChange]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  // Update progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    onProgress?.(video.currentTime / video.duration);
  };

  // Toggle Play/Pause on single tap vs double-tap detection
  const handlePointerDown = () => {
    // Start long-press timer (350ms)
    longPressTimerRef.current = setTimeout(() => {
      setShowSpeedSheet(true);
    }, 350);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const now = Date.now();
    const timeSinceLast = now - lastTapRef.current;

    if (timeSinceLast < 280) {
      // Double tap detected!
      lastTapRef.current = 0;
      addDoubleTapLike(
        item.id,
        e.clientX,
        e.clientY,
        item.onLike?.effect,
        item.onLike?.payload
      );
      wish("doubleTap", { clipId: item.id });
    } else {
      // Potential single tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now && !showSpeedSheet) {
          togglePlay();
        }
      }, 290);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      onPlayStateChange?.(true);
      wish("pause");
    } else {
      video.pause();
      setIsPlaying(false);
      setShowPlayIcon(true);
      onPlayStateChange?.(false);
      setTimeout(() => setShowPlayIcon(false), 300);
      wish("pause");
    }
  };

  const handleSetSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    setShowSpeedSheet(false);
    if (newSpeed === 2) wish("speedUp");
    if (newSpeed === 0.5) wish("speedDown");
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-label={isPlaying ? "Video sedang diputar" : "Video dijeda"}
      className="relative w-full h-full bg-black select-none overflow-hidden"
    >
      {/* Dev empty-slot placeholder or native video */}
      {item.isEmptyPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-[#161823] border border-[#3a3a3a] flex items-center justify-center text-[28px] mb-3 text-primary">
            🎬
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-1">
            Slot {item.slot} Kosong
          </h3>
          <p className="text-[13px] text-[#a8a8a8] max-w-[260px]">
            Taruh video di <code className="text-primary font-mono">content/media/{item.slot}/video.mp4</code> lalu jalankan <code className="text-white">npm run media</code>
          </p>
        </div>
      ) : (
        <>
          {/* Blurred background backdrop for landscape videos */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-2xl brightness-60 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${item.poster || ""})` }}
          />

          {/* Native video element */}
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            muted={muted}
            playsInline
            loop
            preload={isActive ? "auto" : "metadata"}
            onTimeUpdate={handleTimeUpdate}
            className="relative z-10 w-full h-full object-cover"
          />
        </>
      )}

      {/* 72px center pause icon flash */}
      {showPlayIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-[72px] h-[72px] rounded-full bg-black/40 flex items-center justify-center text-white/80 animate-in zoom-in-75 duration-150">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Long-press Speed / Options Sheet */}
      {showSpeedSheet && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            e.stopPropagation();
            setShowSpeedSheet(false);
          }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-t-2xl bg-[#1f1f1f] border-t border-[#3a3a3a] p-4 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="w-full flex justify-center">
              <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
            </div>

            <h3 className="text-[14px] font-semibold text-[#a8a8a8] text-center">
              Kecepatan Video
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSetSpeed(s)}
                  className={`py-2.5 rounded-lg border text-[14px] font-semibold transition-colors ${
                    speed === s
                      ? "border-primary bg-primary text-white"
                      : "border-[#3a3a3a] bg-[#161823] text-white hover:border-white/50"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSpeedSheet(false);
                alert("Mustahil tidak tertarik, ini kisah kita! ❤️");
              }}
              className="w-full py-3 rounded-lg border border-[#3a3a3a] bg-[#161823] text-white/80 hover:text-white text-[14px] font-medium"
            >
              Tidak Tertarik (&quot;Mustahil, ini kita!&quot;)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
