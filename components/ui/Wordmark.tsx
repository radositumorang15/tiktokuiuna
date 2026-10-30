"use client";

import React, { useState, useEffect } from "react";
import { wish } from "@/lib/wishes";

interface WordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCake?: boolean;
  onEasterEgg?: () => void;
}

export function Wordmark({
  className = "",
  size = "md",
  showCake = false,
  onEasterEgg,
}: WordmarkProps) {
  const [tapCount, setTapCount] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

  // Periodic random glitch (every 6-10s)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const scheduleNextGlitch = () => {
      const delay = 6000 + Math.random() * 4000;
      timer = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
          scheduleNextGlitch();
        }, 120);
      }, delay);
    };

    scheduleNextGlitch();
    return () => clearTimeout(timer);
  }, []);

  const handleTap = () => {
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (nextCount >= 5) {
      setTapCount(0);
      wish("easterEgg");
      onEasterEgg?.();
    }
  };

  const textSizes = {
    sm: "text-[18px] leading-[24px]",
    md: "text-[24px] leading-[32px]",
    lg: "text-[32px] leading-[40px]",
    xl: "text-[42px] leading-[50px]",
  };

  const cyanOffset = isGlitching ? "translate(-3px, -2px)" : "translate(-1.5px, -1px)";
  const magentaOffset = isGlitching ? "translate(3px, 2px)" : "translate(1.5px, 1px)";

  return (
    <div
      onClick={handleTap}
      role="button"
      tabIndex={0}
      aria-label="ForUs Wordmark"
      className={`relative inline-block font-sans font-semibold tracking-tight select-none cursor-pointer ${textSizes[size]} ${className}`}
    >
      {/* Cyan chromatic aberration layer */}
      <span
        aria-hidden="true"
        style={{ transform: cyanOffset }}
        className="absolute inset-0 text-[#25f4ee] opacity-80 transition-transform duration-75 select-none pointer-events-none"
      >
        ForUs{showCake ? " 🎂" : ""}
      </span>

      {/* Magenta chromatic aberration layer */}
      <span
        aria-hidden="true"
        style={{ transform: magentaOffset }}
        className="absolute inset-0 text-[#fe2c55] opacity-80 transition-transform duration-75 select-none pointer-events-none"
      >
        ForUs{showCake ? " 🎂" : ""}
      </span>

      {/* Main white ink text layer */}
      <span className="relative z-10 text-white">
        ForUs{showCake ? " 🎂" : ""}
      </span>
    </div>
  );
}

