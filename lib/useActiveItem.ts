"use client";

import { useEffect, useState, useRef } from "react";

export function useActiveItem(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>("[data-feed-item]");
    if (!items.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            const indexAttr = entry.target.getAttribute("data-feed-index");
            if (indexAttr !== null) {
              const nextIndex = parseInt(indexAttr, 10);
              setActiveIndex(nextIndex);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.7,
      }
    );

    items.forEach((item) => observerRef.current?.observe(item));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [containerRef]);

  // Pause on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause active native media
        const activeVideo = document.querySelector<HTMLVideoElement>("video:not([paused])");
        activeVideo?.pause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  return activeIndex;
}
