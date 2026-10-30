"use client";

import React, { useEffect, useState } from "react";

interface BalloonRainProps {
  onComplete?: () => void;
}

interface Balloon {
  id: number;
  left: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
}

export function BalloonRain({ onComplete }: BalloonRainProps) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    const colors = ["#fe2c55", "#ffffff", "#25f4ee"];
    const list: Balloon[] = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        left: Math.random() * 90,
        size: 32 + Math.random() * 24,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 1.5,
        duration: 3 + Math.random() * 2,
      });
    }
    setBalloons(list);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {balloons.map((b) => (
        <div
          key={b.id}
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            color: b.color,
          }}
          className="absolute -bottom-16 animate-balloon-rise"
        >
          {/* Heart Balloon */}
          <svg width={b.size} height={b.size} viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes balloonRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-115vh) scale(1.1);
            opacity: 0;
          }
        }
        .animate-balloon-rise {
          animation-name: balloonRise;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}

