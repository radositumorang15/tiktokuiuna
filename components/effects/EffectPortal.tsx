"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { DoubleTapHeart } from "./DoubleTapHeart";
import { HeartsRain } from "./HeartsRain";
import { ConfettiEffect } from "./ConfettiEffect";
import { LetterPop } from "./LetterPop";
import { PhotoReveal } from "./PhotoReveal";
import { GlitchHeart } from "./GlitchHeart";
import { StickerBurst } from "./StickerBurst";
import { VoiceNoteEffect } from "./VoiceNoteEffect";
import { MilestoneEffect } from "./MilestoneEffect";
import { BalloonRain } from "./BalloonRain";

export function EffectPortal() {
  const activeEffect = useStore((s) => s.activeEffect);
  const setActiveEffect = useStore((s) => s.setActiveEffect);
  const flyingHearts = useStore((s) => s.flyingHearts);
  const removeFlyingHeart = useStore((s) => s.removeFlyingHeart);
  const [showBalloonRain, setShowBalloonRain] = useState(false);

  const clearEffect = () => setActiveEffect(null);

  return (
    <>
      {/* 1. Double tap flying hearts */}
      {flyingHearts.map((h) => (
        <DoubleTapHeart key={h.id} heart={h} onComplete={removeFlyingHeart} />
      ))}

      {/* 2. Special like effect */}
      {activeEffect?.effect === "hearts-rain" && (
        <HeartsRain onComplete={clearEffect} />
      )}
      {activeEffect?.effect === "confetti" && (
        <ConfettiEffect onComplete={clearEffect} />
      )}
      {activeEffect?.effect === "letter-pop" && (
        <LetterPop payload={activeEffect.payload} onClose={clearEffect} />
      )}
      {activeEffect?.effect === "photo-reveal" && (
        <PhotoReveal onComplete={clearEffect} />
      )}
      {activeEffect?.effect === "glitch-heart" && (
        <GlitchHeart onComplete={clearEffect} />
      )}
      {activeEffect?.effect === "sticker-burst" && (
        <StickerBurst onComplete={clearEffect} />
      )}
      {activeEffect?.effect === "voice-note" && (
        <VoiceNoteEffect payload={activeEffect.payload} onClose={clearEffect} />
      )}
      {activeEffect?.effect === "milestone" && (
        <MilestoneEffect onComplete={clearEffect} />
      )}

      {/* 3. Easter egg balloon rain */}
      {showBalloonRain && (
        <BalloonRain onComplete={() => setShowBalloonRain(false)} />
      )}
    </>
  );
}
