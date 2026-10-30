"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { sha256 } from "@/lib/hash";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";
import { wish } from "@/lib/wishes";

const PIN_LENGTH = 6;

const FUNNY_MISTAKE_MESSAGES = [
  "Bukan, coba inget-inget lagi 🥺",
  "Masa PIN rahasia kita sendiri lupa sih? 😂",
  "Hayo lho, coba masukkan PIN yang benar ya! 😜",
  "Salah PIN sayang, jangan bikin aku nangis di pojokan 😭",
  "Coba ingat 6 angka istimewa kita berdua ❤️",
];

export default function GatePage() {
  const router = useRouter();
  const unlocked = useStore((s) => s.unlocked);
  const unlockGate = useStore((s) => s.unlockGate);

  const [digits, setDigits] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [bouncingIndex, setBouncingIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already unlocked, redirect to feed immediately
  useEffect(() => {
    if (unlocked) {
      router.replace("/feed");
    } else {
      wish("open");
    }
  }, [unlocked, router]);

  // Focus first input on mount
  useEffect(() => {
    if (!unlocked) {
      inputRefs.current[0]?.focus();
    }
  }, [unlocked]);

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric single characters
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    if (cleanVal) {
      // Trigger jump/bounce micro-animation on typed field
      setBouncingIndex(index);
      setTimeout(() => setBouncingIndex(null), 320);

      // Auto-focus next field
      if (index < PIN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
        setFocusedIndex(index + 1);
      }
    }

    // Auto check when all digits are filled
    if (newDigits.every((d) => d !== "")) {
      validateDate(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, PIN_LENGTH);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);

    const nextFocus = Math.min(pasted.length, PIN_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
    setFocusedIndex(nextFocus);

    if (newDigits.every((d) => d !== "")) {
      validateDate(newDigits.join(""));
    }
  };

  const validateDate = async (pinStr: string) => {
    setIsValidating(true);
    try {
      const hashed = await sha256(pinStr);
      const targetHash = siteConfig.gateHash.toLowerCase().trim();

      if (hashed.toLowerCase() === targetHash) {
        // Unlock Web Audio API context on this user gesture
        if (typeof window !== "undefined") {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            ctx.resume().catch(() => {});
          }
        }

        wish("gate");
        unlockGate();
        router.push("/feed");
      } else {
        // Incorrect PIN
        setIsShaking(true);
        const nextFail = failCount + 1;
        setFailCount(nextFail);
        const randomMsg =
          FUNNY_MISTAKE_MESSAGES[Math.floor(Math.random() * FUNNY_MISTAKE_MESSAGES.length)];
        setErrorMsg(randomMsg);

        setTimeout(() => {
          setIsShaking(false);
        }, 350);
      }
    } catch {
      setErrorMsg("Terjadi kendala validasi, coba lagi.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-black flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-[390px] flex flex-col items-center text-center space-y-6">
        {/* Wordmark with Cake */}
        <Wordmark size="xl" showCake />

        <div className="space-y-2">
          <h1 className="text-[20px] leading-[28px] font-bold text-white tracking-tight">
            Masukkan PIN Rahasia Kita
          </h1>
          <p className="text-[14px] leading-[20px] text-[#a8a8a8]">
            Format {PIN_LENGTH} angka rahasia kita
          </p>
        </div>

        {/* 6 Digit Animated Inputs */}
        <div
          className={`flex items-center justify-center gap-3 ${
            isShaking ? "animate-shake" : ""
          }`}
        >
          {digits.map((digit, idx) => {
            const isFocused = focusedIndex === idx;
            const isBouncing = bouncingIndex === idx;
            const isFilled = !!digit;

            return (
              <div key={idx} className="relative">
                <input
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onFocus={() => setFocusedIndex(idx)}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={`w-[46px] h-[58px] text-center text-[24px] font-bold rounded-xl text-white bg-[#161823] border focus:outline-none transition-all duration-200 select-none ${
                    isFocused
                      ? "border-primary shadow-[0_0_16px_rgba(254,44,85,0.45)] -translate-y-2 scale-105"
                      : isFilled
                      ? "border-primary/60 bg-[#1f1f1f] shadow-[0_0_8px_rgba(254,44,85,0.2)] -translate-y-0.5"
                      : "border-[#3a3a3a] opacity-80"
                  } ${isBouncing ? "animate-digit-bounce" : ""}`}
                />
              </div>
            );
          })}
        </div>

        {/* Error / Funny Messages */}
        {errorMsg && (
          <p className="text-[14px] font-medium text-primary animate-in fade-in duration-200">
            {errorMsg}
          </p>
        )}

        {/* Clue after 5 failures */}
        {failCount >= 5 && (
          <div className="p-3 rounded-lg bg-[#1f1f1f] border border-[#4a4a4a] text-[13px] text-white/90 animate-in fade-in">
            💡 <span className="font-semibold text-primary">Petunjuk:</span> PIN rahasia kamu adalah <span className="font-mono font-bold text-white">172312</span>
          </div>
        )}

        {/* Submit Button fallback */}
        <button
          type="button"
          disabled={isValidating || digits.some((d) => !d)}
          onClick={() => validateDate(digits.join(""))}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-[15px] active:scale-95 disabled:opacity-40 transition-all shadow-lg shadow-primary/20"
        >
          {isValidating ? "Membuka ForUs..." : "Mulai Buka Kenangan Kita ❤️"}
        </button>
      </div>

      <style jsx>{`
        @keyframes digitBounce {
          0% {
            transform: translateY(0) scale(1);
          }
          30% {
            transform: translateY(-12px) scale(1.25) rotate(-3deg);
          }
          65% {
            transform: translateY(-4px) scale(1.08) rotate(2deg);
          }
          100% {
            transform: translateY(-8px) scale(1.05) rotate(0deg);
          }
        }
        .animate-digit-bounce {
          animation: digitBounce 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          20%, 60% {
            transform: translateX(-10px);
          }
          40%, 80% {
            transform: translateX(10px);
          }
        }
        .animate-shake {
          animation: shake 300ms ease-in-out;
        }
      `}</style>
    </div>
  );
}
