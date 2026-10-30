"use client";

import React, { useEffect } from "react";

interface GlitchHeartProps {
  onComplete: () => void;
}

export function GlitchHeart({ onComplete }: GlitchHeartProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center animate-in fade-in duration-150"
    >
      <div className="relative animate-pulse">
        {/* Cyan Aberration Ghost */}
        <div className="absolute inset-0 translate-x-[-4px] translate-y-[-2px] text-[#25f4ee] opacity-80 animate-glitch-cyan">
          <svg width="128" height="128" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
          </svg>
        </div>

        {/* Magenta Aberration Ghost */}
        <div className="absolute inset-0 translate-x-[4px] translate-y-[2px] text-[#fe2c55] opacity-80 animate-glitch-magenta">
          <svg width="128" height="128" viewBox="0 0 48 48" fill="currentColor">
            <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
          </svg>
        </div>

        {/* Main Solid White/Magenta Heart */}
        <div className="relative text-white">
          <svg width="128" height="128" viewBox="0 0 48 48" fill="#fe2c55">
            <path d="M24 41.5C23.2 41.5 22.4 41.2 21.8 40.6C12.8 32.5 7 27.2 4.4 22.4C1.5 17 2.3 10.6 6.3 6.6C10.3 2.6 16.7 2.6 20.7 6.6L24 9.9L27.3 6.6C31.3 2.6 37.7 2.6 41.7 6.6C45.7 10.6 46.5 17 43.6 22.4C41 27.2 35.2 32.5 26.2 40.6C25.6 41.2 24.8 41.5 24 41.5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

