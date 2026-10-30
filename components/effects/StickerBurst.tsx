"use client";

import React, { useEffect } from "react";

interface StickerBurstProps {
  onComplete: () => void;
}

export function StickerBurst({ onComplete }: StickerBurstProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const stickers = [
    { text: "Sayang ❤️", top: "25%", left: "15%", rot: "-12deg", delay: "0ms" },
    { text: "Cantik Banget! ✨", top: "40%", left: "55%", rot: "8deg", delay: "150ms" },
    { text: "Kangen 🥺", top: "60%", left: "20%", rot: "-6deg", delay: "300ms" },
    { text: "Milikku Selamanya 🔒", top: "35%", left: "25%", rot: "14deg", delay: "450ms" },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {stickers.map((s, idx) => (
        <div
          key={idx}
          style={{
            top: s.top,
            left: s.left,
            transform: `rotate(${s.rot})`,
            animationDelay: s.delay,
          }}
          className="absolute animate-sticker-pop px-3.5 py-1.5 rounded-full bg-white text-black font-semibold text-[15px] border-2 border-primary shadow-xl select-none"
        >
          {s.text}
        </div>
      ))}
      <style jsx>{`
        @keyframes stickerPop {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.15) rotate(5deg);
          }
          70% {
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-sticker-pop {
          animation: stickerPop 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
