"use client";

import { useEffect, useState, useRef } from "react";

export function useActiveItem(
  containerRef: React.RefObject<HTMLDivElement | null>,
  itemCount: number = 0
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Direct scroll listener: guaranteed 100% sync on snap/touch/wheel
    const handleScroll = () => {
      const h = container.clientHeight;
      if (h > 0) {
        const idx = Math.round(container.scrollTop / h);
        setActiveIndex((prev) => (prev !== idx ? idx : prev));
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check in case container is already scrolled
    handleScroll();

    // 2. Setup IntersectionObserver as secondary precision observer
    const setupObserver = () => {
      const items = container.querySelectorAll<HTMLElement>("[data-feed-item]");
      if (!items.length) return;

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver(
        (entries) => {
          let maxRatio = 0;
          let targetIndex: number | null = null;

          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              const indexAttr = entry.target.getAttribute("data-feed-index");
              if (indexAttr !== null) {
                maxRatio = entry.intersectionRatio;
                targetIndex = parseInt(indexAttr, 10);
              }
            }
          });

          if (targetIndex !== null && maxRatio >= 0.45) {
            setActiveIndex(targetIndex);
          }
        },
        {
          root: container,
          threshold: [0.3, 0.5, 0.7, 0.9],
        }
      );

      items.forEach((item) => observerRef.current?.observe(item));
    };

    setupObserver();

    // 3. MutationObserver so when items dynamically populate DOM, observer attaches immediately
    const mutationObserver = new MutationObserver(() => {
      setupObserver();
      handleScroll();
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
    };
  }, [containerRef, itemCount]);

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
