"use client";

import React, { useEffect, useState } from "react";
import { subscribeWish, type ActiveWish } from "@/lib/wishes";
import { useStore } from "@/lib/store";

export function WishToast() {
  const [activeWish, setActiveWish] = useState<ActiveWish | null>(null);
  const wishesEnabled = useStore((s) => s.wishesEnabled);

  useEffect(() => {
    const unsubscribe = subscribeWish((wish) => {
      setActiveWish(wish);
    });
    return unsubscribe;
  }, []);

  if (!wishesEnabled || !activeWish) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
      style={{ bottom: "calc(56px + env(safe-area-inset-bottom) + 16px)" }}
    >
      <div
        className="flex items-center gap-2 max-w-[90vw] md:max-w-[360px] px-3.5 py-2 rounded-full bg-[#1f1f1f] border border-[#3a3a3a] text-white shadow-lg pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
      >
        <span className="text-[16px] shrink-0" aria-hidden="true">
          {activeWish.iconType === "cake" && "🎂"}
          {activeWish.iconType === "heart" && "❤️"}
          {activeWish.iconType === "candle" && "🕯️"}
          {activeWish.iconType === "sparkles" && "✨"}
        </span>
        <span className="text-[14px] leading-[20px] font-normal tracking-tight text-white line-clamp-2">
          {activeWish.text}
        </span>
      </div>
    </div>
  );
}
