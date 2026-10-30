"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiEffectProps {
  onComplete?: () => void;
}

export function ConfettiEffect({ onComplete }: ConfettiEffectProps) {
  useEffect(() => {
    // Only two brand colors + white: #fe2c55, #25f4ee, #ffffff
    const colors = ["#fe2c55", "#25f4ee", "#ffffff"];

    // Left bottom blast
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.85 },
      colors,
    });

    // Right bottom blast
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.85 },
      colors,
    });

    const timer = setTimeout(() => {
      onComplete?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return null;
}
