"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { type FeedItem } from "@/content/feed";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";
import { VolumeMuteIcon } from "@/components/icons/TikTokIcons";

interface PhotoTileProps {
  item: FeedItem;
  isActive: boolean;
  onPhotoIndexChange?: (index: number) => void;
  onProgress?: (progress: number) => void;
  showInternalProgressBar?: boolean;
}

export function PhotoTile({
  item,
  isActive,
  onPhotoIndexChange,
  onProgress,
  showInternalProgressBar = false,
}: PhotoTileProps) {
  const photos =
    item.photos && item.photos.length > 0
      ? item.photos
      : [
          { src: item.poster || "/media/slot-02/01.jpg", caption: item.caption },
        ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPausedHold, setIsPausedHold] = useState(false);
  const [segmentProgress, setSegmentProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const muted = useStore((s) => s.muted);
  const addDoubleTapLike = useStore((s) => s.addDoubleTapLike);

  const pointerStartX = useRef<number>(0);
  const pointerStartTime = useRef<number>(0);
  const isPointerDown = useRef<boolean>(false);
  const lastTapRef = useRef<number>(0);

  const durationMs = (item.secondsPerPhoto || 3.5) * 1000;
  const hasAudio = Boolean(item.song?.audio);

  // Reset index when slot changes
  useEffect(() => {
    setCurrentIndex(0);
    setSegmentProgress(0);
  }, [item.id, item.photos?.length]);

  // Audio playback sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    audio.muted = muted;
    if (isActive && !isPausedHold) {
      audio.play().catch(() => {
        audio.muted = true;
        audio.play().catch(() => {});
        useStore.setState({ muted: true });
      });
    } else {
      audio.pause();
    }
  }, [isActive, isPausedHold, hasAudio, muted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // Go to specific index helper
  const goToIndex = useCallback(
    (index: number) => {
      const next = (index + photos.length) % photos.length;
      setCurrentIndex(next);
      setSegmentProgress(0);
      onPhotoIndexChange?.(next);
      onProgress?.(0);
    },
    [photos.length, onPhotoIndexChange, onProgress]
  );

  // TikTok Automatic Carousel Advance Loop
  useEffect(() => {
    if (!isActive || isPausedHold || photos.length <= 1) return;

    let animId: number;
    let startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setSegmentProgress(progress);
      onProgress?.(progress);

      if (progress >= 1) {
        // Move to next photo automatically
        setCurrentIndex((prev) => {
          const next = (prev + 1) % photos.length;
          onPhotoIndexChange?.(next);
          return next;
        });
        setSegmentProgress(0);
        onProgress?.(0);
        startTime = performance.now();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isActive, isPausedHold, currentIndex, photos.length, durationMs, onPhotoIndexChange, onProgress]);

  // Unified Pointer handlers (Touch on mobile + Mouse on desktop)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isPointerDown.current = true;
    pointerStartX.current = e.clientX;
    pointerStartTime.current = Date.now();
    setIsPausedHold(true);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    setIsPausedHold(false);

    const diffX = pointerStartX.current - e.clientX;
    const elapsed = Date.now() - pointerStartTime.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRelX = e.clientX - rect.left;

    // 1. Swipe detection (horizontal movement > 35px)
    if (Math.abs(diffX) > 35) {
      if (diffX > 0) {
        // Swiped left -> next photo
        goToIndex(currentIndex + 1);
      } else {
        // Swiped right -> prev photo
        goToIndex(currentIndex - 1);
      }
      return;
    }

    // 2. Tap detection (short click with almost no movement)
    if (elapsed < 300 && Math.abs(diffX) < 10) {
      const now = Date.now();
      const timeSinceLast = now - lastTapRef.current;

      if (timeSinceLast < 280) {
        // Double-tap detected: trigger like!
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
        lastTapRef.current = now;
        // Single tap: tap left 30% goes to previous, tap right 70% goes to next
        if (clickRelX < rect.width * 0.3) {
          goToIndex(currentIndex - 1);
        } else if (clickRelX > rect.width * 0.7) {
          goToIndex(currentIndex + 1);
        }
      }
    }
  };

  const handlePointerCancel = () => {
    isPointerDown.current = false;
    setIsPausedHold(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      className="relative w-full h-full bg-black select-none overflow-hidden touch-pan-y cursor-pointer"
    >
      {/* Background audio track */}
      {hasAudio && item.song?.audio && (
        <audio
          ref={audioRef}
          src={item.song.audio}
          loop
          preload={isActive ? "auto" : "none"}
          className="hidden"
        />
      )}

      {/* Dev empty-slot placeholder */}
      {item.isEmptyPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-[#161823] border border-[#3a3a3a] flex items-center justify-center text-[28px] mb-3 text-primary">
            📸
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-1">
            Slot {item.slot} Kosong
          </h3>
          <p className="text-[13px] text-[#a8a8a8] max-w-[260px]">
            Taruh foto di <code className="text-primary font-mono">content/media/{item.slot}/</code> atau unggah lewat Studio.
          </p>
        </div>
      ) : (
        <>
          {/* Sliding Photos Track */}
          <div
            className="flex w-full h-full transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {photos.map((photo, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={idx}
                  className="relative w-full h-full shrink-0 flex items-center justify-center overflow-hidden bg-black"
                >
                  {/* Blurred Backdrop */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-3xl brightness-50 scale-125"
                    style={{ backgroundImage: `url(${photo.src})` }}
                  />

                  {/* Photo Styling Variant */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {item.photoStyle === "polaroid" ? (
                      /* Polaroid frame with rotation */
                      <div
                        className="bg-white p-3 pb-8 shadow-2xl rounded-sm max-w-[90%] max-h-[82%] flex flex-col items-center justify-between transition-all duration-500 ease-out border border-[#e5e5e5]"
                        style={{
                          transform: isCurrent
                            ? `rotate(${idx % 2 === 0 ? "-2.5deg" : "2.5deg"}) scale(1)`
                            : `rotate(${idx % 2 === 0 ? "4deg" : "-4deg"}) scale(0.92)`,
                        }}
                      >
                        <div className="w-full aspect-[4/5] overflow-hidden bg-black rounded-xs">
                          <img
                            src={photo.src}
                            alt={photo.caption || "Momen Kita"}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[#1a1a1a] text-[13px] font-semibold mt-3 text-center tracking-tight font-sans">
                          {photo.caption || item.caption || `Momen #${idx + 1}`}
                        </p>
                      </div>
                    ) : item.photoStyle === "stack" ? (
                      /* Stack of cards */
                      <div className="relative w-full h-full flex items-center justify-center p-6">
                        <div
                          className="absolute w-[82%] aspect-[9/14] bg-[#222] rounded-2xl border border-white/10 shadow-2xl transition-transform duration-500 pointer-events-none"
                          style={{
                            transform: `rotate(${idx % 2 === 0 ? "4deg" : "-4deg"}) scale(0.94)`,
                            opacity: 0.6,
                          }}
                        />
                        <div
                          className="relative z-10 w-[86%] aspect-[9/14] rounded-2xl overflow-hidden bg-[#161823] border border-white/20 shadow-2xl transition-all duration-500 flex flex-col"
                          style={{
                            transform: isCurrent
                              ? "rotate(0deg) scale(1)"
                              : `rotate(${idx % 2 === 0 ? "-3deg" : "3deg"}) scale(0.96)`,
                          }}
                        >
                          <img
                            src={photo.src}
                            alt={photo.caption || "Momen"}
                            loading="eager"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                          {photo.caption && (
                            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-[12px] font-semibold text-white">
                              {photo.caption}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : item.photoStyle === "kenburns" ? (
                      /* Ken Burns slow zoom */
                      <img
                        src={photo.src}
                        alt={photo.caption || "Momen"}
                        loading="eager"
                        decoding="async"
                        style={{
                          animation:
                            isActive && isCurrent
                              ? `kenBurnsZoom ${durationMs}ms ease-in-out infinite alternate`
                              : "none",
                        }}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      /* Plain 9:16 cover/contain */
                      <img
                        src={photo.src}
                        alt={photo.caption || "Momen"}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating TikTok-style unmute badge */}
          {isActive && hasAudio && muted && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                useStore.getState().toggleMute();
                wish("unmute");
                if (audioRef.current) {
                  audioRef.current.muted = false;
                  audioRef.current.play().catch(() => {});
                }
              }}
              aria-label="Nyalakan suara musik"
              className="absolute left-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[12px] font-medium shadow-lg active:scale-95 transition-transform"
              style={{ top: "calc(64px + env(safe-area-inset-top, 0px))" }}
            >
              <VolumeMuteIcon size={16} className="text-[#fe2c55]" />
              <span>Ketuk untuk bersuara</span>
            </button>
          )}

          {/* 1/N Pill Top-Right */}
          <div
            className="absolute right-4 z-20 px-2.5 py-1 rounded-full bg-[#1f1f1f]/75 backdrop-blur-sm border border-white/10 text-white text-[12px] font-medium tracking-tight pointer-events-none"
            style={{ top: "calc(64px + env(safe-area-inset-top, 0px))" }}
          >
            {currentIndex + 1}/{photos.length}
          </div>

          {/* Optional internal progress bar for Studio Live Preview */}
          {showInternalProgressBar && photos.length > 1 && (
            <div className="absolute left-0 right-0 bottom-3 z-30 flex items-center gap-1 px-3 pointer-events-none">
              {photos.map((_, idx) => (
                <div
                  key={idx}
                  className="relative flex-1 h-[2px] rounded-full bg-white/25 overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{
                      width:
                        idx < currentIndex
                          ? "100%"
                          : idx === currentIndex
                          ? `${Math.min(100, Math.max(0, segmentProgress * 100))}%`
                          : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Dot indicators */}
          {photos.length > 1 && !showInternalProgressBar && (
            <div
              className="absolute left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-none"
              style={{ bottom: "calc(68px + env(safe-area-inset-bottom, 0px))" }}
            >
              {photos.map((_, dotIdx) => (
                <div
                  key={dotIdx}
                  className={`w-[6px] h-[6px] rounded-full transition-all duration-200 ${
                    dotIdx === currentIndex
                      ? "bg-white scale-110"
                      : "bg-white/35"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
