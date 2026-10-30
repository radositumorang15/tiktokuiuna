"use client";

import React, { useEffect, useState } from "react";

interface RepostFlightProps {
  posterSrc?: string;
  onComplete: () => void;
}

export function RepostFlight({ posterSrc, onComplete }: RepostFlightProps) {
  const [coords, setCoords] = useState<{ startX: number; startY: number; targetX: number; targetY: number } | null>(null);

  useEffect(() => {
    // Locate Profile nav button
    const profileEl = document.getElementById("profile-nav-icon");
    const targetRect = profileEl
      ? profileEl.getBoundingClientRect()
      : { left: window.innerWidth * 0.85, top: window.innerHeight - 30, width: 24, height: 24 };

    setCoords({
      startX: window.innerWidth / 2,
      startY: window.innerHeight / 2,
      targetX: targetRect.left + targetRect.width / 2,
      targetY: targetRect.top + targetRect.height / 2,
    });

    const timer = setTimeout(() => {
      onComplete();
    }, 650);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!coords) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Glitch cyan ghost trail */}
      <div
        style={{
          left: coords.startX,
          top: coords.startY,
          "--target-x": `${coords.targetX - coords.startX - 4}px`,
          "--target-y": `${coords.targetY - coords.startY - 4}px`,
        } as React.CSSProperties}
        className="absolute w-[120px] h-[180px] rounded-lg border-2 border-[#25f4ee] bg-[#25f4ee]/20 opacity-60 animate-fly-curve"
      />

      {/* Glitch magenta ghost trail */}
      <div
        style={{
          left: coords.startX,
          top: coords.startY,
          "--target-x": `${coords.targetX - coords.startX + 4}px`,
          "--target-y": `${coords.targetY - coords.startY + 4}px`,
        } as React.CSSProperties}
        className="absolute w-[120px] h-[180px] rounded-lg border-2 border-[#fe2c55] bg-[#fe2c55]/20 opacity-60 animate-fly-curve"
      />

      {/* Main Flying Card */}
      <div
        style={{
          left: coords.startX,
          top: coords.startY,
          "--target-x": `${coords.targetX - coords.startX}px`,
          "--target-y": `${coords.targetY - coords.startY}px`,
        } as React.CSSProperties}
        className="absolute w-[120px] h-[180px] rounded-lg border-2 border-white bg-[#1f1f1f] overflow-hidden shadow-2xl animate-fly-curve"
      >
        <img
          src={posterSrc || "/media/slot-01/poster.webp"}
          alt="Poster"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 180' fill='%231f1f1f'%3E%3Crect width='120' height='180' fill='%23161823'/%3E%3Ctext x='50%25' y='50%25' fill='%23fe2c55' font-size='12' text-anchor='middle'%3ERepost ❤️%3C/text%3E%3C/svg%3E";
          }}
          className="w-full h-full object-cover"
        />
      </div>

      <style jsx>{`
        @keyframes flyCurve {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(
                calc(var(--target-x) * 0.7),
                calc(var(--target-y) * 0.7 - 60px)
              )
              scale(0.5);
            opacity: 0.9;
          }
          100% {
            transform: translate(var(--target-x), var(--target-y)) scale(0.1);
            opacity: 0;
          }
        }
        .animate-fly-curve {
          animation: flyCurve 600ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
        }
      `}</style>
    </div>
  );
}
