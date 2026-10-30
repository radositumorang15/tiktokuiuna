"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { wish } from "@/lib/wishes";

export function FinaleDialog() {
  const isOpen = useStore((s) => s.isFinaleOpen);
  const closeFinale = useStore((s) => s.closeFinale);
  const setLastIndex = useStore((s) => s.setLastIndex);

  // Ritual stages: "candles" -> "letter"
  const [stage, setStage] = useState<"candles" | "letter">("candles");
  const [candlesBlown, setCandlesBlown] = useState([false, false, false, false, false]);
  const [isBlowingHold, setIsBlowingHold] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fullLetter = siteConfig.finale.body;
  const turningAge = siteConfig.birthday.turning || 22;

  // Initialize Microphone for candle blow ritual
  useEffect(() => {
    if (!isOpen || stage !== "candles") return;

    let isMounted = true;

    async function initMic() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) return;
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        audioStreamRef.current = stream;

        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (!isMounted) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;

          // If sound level exceeds threshold (blow sound)
          if (avg > 55) {
            extinguishCandles();
            return;
          }
          requestAnimationFrame(checkVolume);
        };
        requestAnimationFrame(checkVolume);
      } catch {
        // Silently fallback to hold to blow
      }
    }

    initMic();

    return () => {
      isMounted = false;
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    };
  }, [isOpen, stage]);

  // Handle extinguishing candles
  const extinguishCandles = () => {
    // Release mic stream immediately (Engineering §Privacy)
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }

    // Extinguish candles one by one
    [0, 1, 2, 3, 4].forEach((idx) => {
      setTimeout(() => {
        setCandlesBlown((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
      }, idx * 180);
    });

    // Confetti blast
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#fe2c55", "#25f4ee", "#ffffff"],
      });
      wish("finale");
      setStage("letter");
    }, 1200);
  };

  // Hold-to-blow fallback
  const handleHoldStart = () => {
    setIsBlowingHold(true);
    let current = 0;
    holdIntervalRef.current = setInterval(() => {
      current += 5;
      setHoldProgress(current);
      if (current >= 100) {
        if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
        extinguishCandles();
      }
    }, 100);
  };

  const handleHoldEnd = () => {
    setIsBlowingHold(false);
    setHoldProgress(0);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  // Typewriter effect for letter
  useEffect(() => {
    if (stage !== "letter") return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedText(fullLetter.slice(0, index));
      if (index >= fullLetter.length) {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [stage, fullLetter]);

  if (!isOpen) return null;

  const waUrl = getWhatsAppUrl(
    siteConfig.whatsapp.number,
    siteConfig.whatsapp.templates.finaleReply
  );

  const handleRestartFeed = () => {
    setLastIndex(0);
    closeFinale();
    window.location.href = "/feed";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Kejutan Puncak Ulang Tahun"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="w-full max-w-[390px] rounded-2xl bg-[#161823] border border-[#3a3a3a] p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-300 text-center">
        {stage === "candles" ? (
          /* Candle ritual */
          <div className="space-y-5">
            <div>
              <span className="text-[12px] font-semibold text-primary uppercase tracking-widest">
                Ritual Ulang Tahun 🎂
              </span>
              <h2 className="text-[20px] font-bold text-white mt-1">
                Tiup Lilin & Buat Permohonan
              </h2>
              <p className="text-[13px] text-[#a8a8a8] mt-1">
                Tutup matamu sejenak, panjatkan satu doa terindah di umur {turningAge}.
              </p>
            </div>

            {/* Cake with Candles */}
            <div className="py-6 flex flex-col items-center justify-center">
              {/* Candles Row */}
              <div className="flex items-end justify-center gap-4 mb-2">
                {[0, 1, 2, 3, 4].map((idx) => {
                  const isBlown = candlesBlown[idx];
                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Flame */}
                      <div
                        className={`w-3 h-5 rounded-full bg-gradient-to-t from-orange-500 to-yellow-300 transition-all duration-300 ${
                          isBlown
                            ? "opacity-0 scale-0 -translate-y-2"
                            : "animate-pulse shadow-[0_0_8px_#fe2c55]"
                        }`}
                      />
                      {/* Candle Stick */}
                      <div className="w-2.5 h-10 bg-white rounded-t-sm border border-black/20" />
                    </div>
                  );
                })}
              </div>

              {/* Cake Body */}
              <div className="w-[180px] h-[50px] rounded-t-2xl bg-gradient-to-r from-pink-500 via-primary to-pink-500 flex items-center justify-center shadow-lg border-t-2 border-white/50">
                <span className="text-[14px] font-bold text-white tracking-wider">
                  {turningAge} TAHUN ✨
                </span>
              </div>
              <div className="w-[210px] h-[30px] rounded-b-xl bg-[#2a1a24] border-t border-pink-400/30 flex items-center justify-center" />
            </div>

            {/* Blow instructions & Hold Button */}
            <div className="space-y-3">
              <p className="text-[12px] text-white/80">
                Tiup ke arah mikrofon HP-mu 🎙️ atau tekan dan tahan tombol di bawah:
              </p>

              <button
                type="button"
                onMouseDown={handleHoldStart}
                onMouseUp={handleHoldEnd}
                onTouchStart={handleHoldStart}
                onTouchEnd={handleHoldEnd}
                className="relative overflow-hidden w-full py-3 rounded-xl bg-[#1f1f1f] border border-primary/50 text-white font-semibold text-[14px] select-none active:scale-95 transition-transform"
              >
                {/* Hold progress bar */}
                <div
                  style={{ width: `${holdProgress}%` }}
                  className="absolute inset-0 bg-primary/40 pointer-events-none transition-all duration-75"
                />
                <span className="relative z-10">
                  {isBlowingHold ? `Meniup... ${holdProgress}%` : "Tahan 2 Detik Untuk Tiup Lilin 💨"}
                </span>
              </button>
            </div>
          </div>
        ) : (
          /* Birthday letter card */
          <div className="space-y-4 text-left">
            <div className="text-center pb-2 border-b border-[#3a3a3a]">
              <span className="text-[28px]">💌</span>
              <h2 className="text-[18px] font-bold text-white mt-1">
                {siteConfig.finale.title}
              </h2>
              <span className="text-[12px] text-[#a8a8a8]">
                Dari {siteConfig.couple.me} untuk {siteConfig.couple.her}
              </span>
            </div>

            {/* Typewriter letter text container */}
            <div className="min-h-[160px] max-h-[40vh] overflow-y-auto p-3.5 rounded-xl bg-[#1f1f1f] border border-[#3a3a3a]">
              <p className="text-[14px] leading-[22px] text-white/95 whitespace-pre-line font-sans">
                {typedText}
                {!isTypingComplete && (
                  <span className="inline-block w-1.5 h-4 ml-0.5 bg-primary animate-pulse" />
                )}
              </p>
            </div>

            {/* Actions: Balas ke aku & Putar ulang */}
            <div className="space-y-2 pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-white font-semibold text-[15px] active:scale-95 transition-transform"
              >
                <span>Balas ke WhatsApp Aku</span>
                <span>💬</span>
              </a>

              <button
                type="button"
                onClick={handleRestartFeed}
                className="w-full py-2.5 rounded-lg border border-[#4a4a4a] text-[#a8a8a8] hover:text-white text-[13px] font-medium"
              >
                Putar Ulang Dari Awal 🔁
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

