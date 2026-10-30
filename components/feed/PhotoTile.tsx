"use client";

import React, { useState, useEffect, useRef } from "react";
import { type FeedItem } from "@/content/feed";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";

interface PhotoTileProps {
  item: FeedItem;
  isActive: boolean;
  onPhotoIndexChange?: (index: number) => void;
}

export function PhotoTile({
  item,
  isActive,
  onPhotoIndexChange,
}: PhotoTileProps) {
  const photos = item.photos || [
    { src: item.poster || "/media/slot-02/01.jpg", caption: item.caption },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPausedHold, setIsPausedHold] = useState(false);

  const addDoubleTapLike = useStore((s) => s.addDoubleTapLike);
  const lastTapRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isActive || isPausedHold || item.photoMode !== "slideshow") return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % photos.length;
        onPhotoIndexChange?.(next);
        return next;
      });
    }, (item.secondsPerPhoto || 3) * 1000);

    return () => clearInterval(interval);
  }, [isActive, isPausedHold, item.photoMode, item.secondsPerPhoto, photos.length, onPhotoIndexChange]);

  // Touch handlers for horizontal swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsPausedHold(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPausedHold(false);
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;

    // Horizontal swipe threshold 45px
    if (diff > 45 && currentIndex < photos.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onPhotoIndexChange?.(next);
    } else if (diff < -45 && currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      onPhotoIndexChange?.(prev);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 280) {
      // Double tap
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
    }
  };

  const style = item.photoStyle || "plain";

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
      className="relative w-full h-full bg-black select-none overflow-hidden"
    >
      {/* Dev empty-slot placeholder or photos */}
      {item.isEmptyPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-[#161823] border border-[#3a3a3a] flex items-center justify-center text-[28px] mb-3 text-primary">
            📷
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-1">
            Slot {item.slot} Kosong
          </h3>
          <p className="text-[13px] text-[#a8a8a8] max-w-[260px]">
            Taruh foto di <code className="text-primary font-mono">content/media/{item.slot}/</code> (01.jpg, 02.jpg) lalu jalankan <code className="text-white">npm run media</code>
          </p>
        </div>
      ) : (
        <>
          {/* Photos Container */}
          <div className="w-full h-full relative flex items-center justify-center">
            {photos.map((photo, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-all duration-300 ${
                    isCurrent ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                >
                  {/* Blurred backdrop for landscape photos */}
                  <div
                    className="absolute inset-0 bg-cover bg-center filter blur-2xl brightness-60 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url(${photo.src})` }}
                  />

                  {/* Photo Style variations */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    {style === "polaroid" ? (
                      <div className="p-3 pb-8 bg-white rounded-sm shadow-2xl rotate-[-2deg] max-w-[320px] w-[85%]">
                        <div className="aspect-[3/4] bg-[#1f1f1f] overflow-hidden mb-2">
                          <img
                            src={photo.src}
                            alt={photo.caption || "Momen"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-[12px] font-medium text-black text-center truncate">
                          {photo.caption || item.caption}
                        </p>
                      </div>
                    ) : style === "stack" ? (
                      <div className="w-[88%] aspect-[9/16] rounded-xl overflow-hidden border-2 border-white/20 shadow-2xl">
                        <img
                          src={photo.src}
                          alt={photo.caption || "Momen"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : style === "kenburns" ? (
                      <img
                        src={photo.src}
                        alt={photo.caption || "Momen"}
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] linear ${
                          isActive && isCurrent ? "scale-108" : "scale-100"
                        }`}
                      />
                    ) : (
                      /* Plain 9:16 full cover */
                      <img
                        src={photo.src}
                        alt={photo.caption || "Momen"}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 1/N Pill Top-Right (surface-overlay alpha .6, radius-full, caption-soft 12/16) */}
          <div
            className="absolute right-4 z-20 px-2.5 py-1 rounded-full bg-[#1f1f1f]/75 border border-white/10 text-white text-[12px] font-medium tracking-tight pointer-events-none"
            style={{ top: "calc(64px + env(safe-area-inset-top, 0px))" }}
          >
            {currentIndex + 1}/{photos.length}
          </div>

          {/* Dot indicators above bottom progress bar */}
          {photos.length > 1 && (
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

