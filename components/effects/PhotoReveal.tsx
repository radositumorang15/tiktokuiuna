"use client";

import React, { useEffect } from "react";

interface PhotoRevealProps {
  onComplete: () => void;
}

export function PhotoReveal({ onComplete }: PhotoRevealProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div className="animate-polaroid-drop bg-white p-3 pb-8 rounded-sm shadow-2xl rotate-[-3deg] max-w-[280px] w-full">
        <div className="aspect-[3/4] bg-[#1f1f1f] overflow-hidden mb-3">
          <img
            src="/media/slot-02/01.jpg"
            alt="Momen Spesial"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400' fill='%231f1f1f'%3E%3Crect width='300' height='400' fill='%23161823'/%3E%3Ctext x='50%25' y='50%25' fill='%23fe2c55' font-size='20' text-anchor='middle' font-family='sans-serif'%3EKencan Pertama ❤️%3C/text%3E%3C/svg%3E";
            }}
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-center font-sans font-medium text-black text-[13px] tracking-tight">
          &ldquo;Momen pertama kita berdua ✨&rdquo;
        </p>
      </div>

      <style jsx>{`
        @keyframes polaroidDrop {
          0% {
            opacity: 0;
            transform: translateY(-80px) rotate(-15deg) scale(0.8);
          }
          70% {
            opacity: 1;
            transform: translateY(10px) rotate(-2deg) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotate(-3deg) scale(1);
          }
        }
        .animate-polaroid-drop {
          animation: polaroidDrop 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
