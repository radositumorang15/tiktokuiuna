"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { type FeedItem, getFeedItems } from "@/content/feed";
import { VideoTile } from "./VideoTile";
import { PhotoTile } from "./PhotoTile";
import { RightRail } from "./RightRail";
import { CaptionOverlay } from "./CaptionOverlay";
import { ProgressBar } from "./ProgressBar";
import { RepostFlight } from "@/components/effects/RepostFlight";
import { useActiveItem } from "@/lib/useActiveItem";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";
import { siteConfig } from "@/content/site";

export function FeedColumn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeIndex = useActiveItem(containerRef);

  const [items, setItems] = useState<FeedItem[]>([]);
  const [videoProgress, setVideoProgress] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [flyingPoster, setFlyingPoster] = useState<string | null>(null);

  const reposts = useStore((s) => s.reposts);
  const toggleLike = useStore((s) => s.toggleLike);
  const toggleMute = useStore((s) => s.toggleMute);
  const openFinale = useStore((s) => s.openFinale);

  const bonusUnlocked = reposts.length >= siteConfig.unlock.bonusAfterReposts;

  // Load feed items, respecting bonus unlock
  useEffect(() => {
    const rawItems = getFeedItems();
    const filtered = rawItems.filter((it) => {
      if (it.id === "bonus" && !bonusUnlocked) return false;
      return true;
    });
    setItems(filtered);
  }, [bonusUnlocked]);

  // Wish trigger every 3 clips
  const prevIndexRef = useRef(0);
  useEffect(() => {
    if (activeIndex !== prevIndexRef.current) {
      if (activeIndex > 0 && activeIndex % 3 === 0) {
        wish("clipAdvance", { n: activeIndex + 1 });
      }
      prevIndexRef.current = activeIndex;

      // Check if last clip reached (Finale)
      if (items.length > 0 && activeIndex === items.length - 1) {
        setTimeout(() => {
          openFinale();
        }, 1500);
      }
    }
  }, [activeIndex, items.length, openFinale]);

  // Keyboard navigation & controls
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(items.length - 1, activeIndex + 1);
        const nextEl = container.querySelector(`[data-feed-index="${nextIndex}"]`);
        nextEl?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(0, activeIndex - 1);
        const prevEl = container.querySelector(`[data-feed-index="${prevIndex}"]`);
        prevEl?.scrollIntoView({ behavior: "smooth" });
      } else if (e.key === " ") {
        e.preventDefault();
        wish("pause");
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
        wish(useStore.getState().muted ? "mute" : "unmute");
      } else if (e.key === "l" || e.key === "L") {
        e.preventDefault();
        const activeItem = items[activeIndex];
        if (activeItem) {
          const willLike = toggleLike(activeItem.id, activeItem.onLike?.effect, activeItem.onLike?.payload);
          if (willLike) wish("like", { clipId: activeItem.id });
        }
      }
    },
    [activeIndex, items, toggleLike, toggleMute]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-y-scroll overflow-x-hidden snap-y snap-mandatory bg-black no-scrollbar select-none"
      style={{
        scrollSnapType: "y mandatory",
        overscrollBehavior: "none",
      }}
    >
      {items.map((item, index) => {
        const isActive = index === activeIndex;
        // Only mount video/active elements within +/- 1 range for peak performance
        const shouldMountMedia = Math.abs(index - activeIndex) <= 1;

        return (
          <article
            key={item.id}
            data-feed-item="true"
            data-feed-index={index}
            className="relative w-full h-[100dvh] snap-start snap-always shrink-0 overflow-hidden bg-black"
          >
            {/* Scrims: Top (120px) and Bottom (240px) */}
            <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-[240px] bg-gradient-to-t from-black/75 via-black/35 to-transparent pointer-events-none z-20" />

            {/* Media Tile: Video or Photo Carousel */}
            {shouldMountMedia && (
              item.type === "video" ? (
                <VideoTile
                  item={item}
                  isActive={isActive}
                  onProgress={setVideoProgress}
                  onPlayStateChange={setIsPlaying}
                />
              ) : (
                <PhotoTile
                  item={item}
                  isActive={isActive}
                  onPhotoIndexChange={setPhotoIndex}
                />
              )
            )}

            {/* Right Interaction Rail */}
            <RightRail
              item={item}
              isPlaying={isPlaying}
              onRepostFlight={() => setFlyingPoster(item.poster || "/media/slot-01/poster.webp")}
            />

            {/* Caption Block Overlay */}
            <CaptionOverlay item={item} />

            {/* Progress Bar directly above bottom nav */}
            <ProgressBar
              progress={videoProgress}
              totalSegments={item.type === "photo" ? item.photos?.length : undefined}
              currentSegment={item.type === "photo" ? photoIndex : undefined}
            />
          </article>
        );
      })}

      {/* Repost flight animation */}
      {flyingPoster && (
        <RepostFlight
          posterSrc={flyingPoster}
          onComplete={() => setFlyingPoster(null)}
        />
      )}
    </div>
  );
}
