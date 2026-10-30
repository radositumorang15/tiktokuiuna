"use client";

import React, { useState, useEffect } from "react";
import { calculateDaysTogether } from "@/lib/wishes";

interface MilestoneEffectProps {
  onComplete: () => void;
}

export function MilestoneEffect({ onComplete }: MilestoneEffectProps) {
  const targetDays = calculateDaysTogether();
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    const duration = 1800; // ms
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = Math.floor(eased * targetDays);
      setCurrentCount(val);

      if (progress >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 1200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [targetDays, onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 pointer-events-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#161823] border border-[#3a3a3a] max-w-[320px] w-full shadow-2xl text-center">
        <span className="text-[32px] mb-2">🗓️</span>
        <h4 className="text-[14px] uppercase tracking-wider font-semibold text-[#a8a8a8] mb-1">
          Hari Bersama Kita
        </h4>
        <div className="text-[48px] font-bold text-white tracking-tight my-1">
          {currentCount}
          <span className="text-[20px] text-primary ml-1.5 font-normal">hari</span>
        </div>
        <p className="text-[14px] leading-[20px] text-white/80 mt-1">
          Dan setiap detiknya tetap jadi yang terindah ❤️
        </p>
      </div>
    </div>
  );
}
