"use client";

import React, { useEffect, useState } from "react";

interface HeartsRainProps {
  onComplete?: () => void;
}

interface Particle {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function HeartsRain({ onComplete }: HeartsRainProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      list.push({
        id: i,
        left: Math.random() * 95, // %
        size: 20 + Math.random() * 28, // px
        delay: Math.random() * 1.5, // s
        duration: 2 + Math.random() * 1.2, // s
        opacity: 0.6 + Math.random() * 0.4,
      });
    }
    setParticles(list);

    const timer = setTimeout(() => {
      onComplete?.();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity: p.opacity,
          }}
          className="absolute -top-12 animate-heart-fall text-primary"
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 48 48"
            fill="currentColor"
          >
            <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes heartFall {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(45deg);
          }
        }
        .animate-heart-fall {
          animation-name: heartFall;
          animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
