"use client";

import React, { useEffect } from "react";
import { type FlyingHeart } from "@/lib/store";

interface DoubleTapHeartProps {
  heart: FlyingHeart;
  onComplete: (id: string) => void;
}

export function DoubleTapHeart({ heart, onComplete }: DoubleTapHeartProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(heart.id);
    }, 850);
    return () => clearTimeout(timer);
  }, [heart.id, onComplete]);

  return (
    <div
      style={{
        left: heart.x,
        top: heart.y,
        transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
      }}
      className="pointer-events-none fixed z-50 animate-heart-rise"
    >
      <svg
        width="96"
        height="96"
        viewBox="0 0 48 48"
        fill="#fe2c55"
        className="filter drop-shadow-[0_4px_12px_rgba(254,44,85,0.6)]"
      >
        <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
      </svg>
      <style jsx>{`
        @keyframes heartRise {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(${heart.rotation}deg);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(${heart.rotation}deg);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(${heart.rotation}deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120px) scale(0.9) rotate(${heart.rotation}deg);
          }
        }
        .animate-heart-rise {
          animation: heartRise 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}

