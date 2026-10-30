"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Wordmark } from "@/components/ui/Wordmark";
import { sha256 } from "@/lib/hash";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";
import { wish } from "@/lib/wishes";

const FUNNY_MISTAKE_MESSAGES = [
  "Bukan, coba inget-inget lagi 🥺",
  "Masa tanggal jadian kita sendiri lupa sih? 😂",
  "Hayo lho, dosa kalau ngelupain tanggal bersejarah ini! 😜",
  "Salah tanggal sayang, jangan bikin aku nangis di pojokan 😭",
  "Coba tanya hati kecilmu, kapan kita mulai resmi berdua? ❤️",
];

export default function GatePage() {
  const router = useRouter();
  const unlocked = useStore((s) => s.unlocked);
  const unlockGate = useStore((s) => s.unlockGate);

  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", "", "", ""]);
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

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric single characters
    const cleanVal = val.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-focus next field
    if (cleanVal && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto check when all 8 digits filled
    if (newDigits.every((d) => d !== "")) {
      validateDate(newDigits.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateDate = async (dateStr: string) => {
    setIsValidating(true);
    try {
      const hashed = await sha256(dateStr);
      const targetHash = siteConfig.gateHash.toLowerCase().trim();

      if (hashed.toLowerCase() === targetHash) {
        // Unlock Web Audio API context on this user gesture
        if (typeof window !== "undefined") {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (AudioContextClass) {
            const ctx = new AudioContextClass();
            ctx.resume().catch(() => {});
          }
        }

        wish("gate");
        unlockGate();
        router.push("/feed");
      } else {
        // Incorrect date
        setIsShaking(true);
        const nextFail = failCount + 1;
        setFailCount(nextFail);
        const randomMsg = FUNNY_MISTAKE_MESSAGES[Math.floor(Math.random() * FUNNY_MISTAKE_MESSAGES.length)];
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
      <div className="w-full max-w-[380px] flex flex-col items-center text-center space-y-6">
        {/* Wordmark with Cake */}
        <Wordmark size="xl" showCake />

        <div className="space-y-2">
          <h1 className="text-[20px] leading-[28px] font-bold text-white tracking-tight">
            Masukkan Tanggal Jadian Kita
          </h1>
          <p className="text-[14px] leading-[20px] text-[#a8a8a8]">
            Format 8 angka: <span className="font-mono text-white/90">DDMMYYYY</span>
          </p>
        </div>

        {/* 8 Digit Inputs */}
        <div
          className={`flex items-center justify-center gap-2 ${
            isShaking ? "animate-shake" : ""
          }`}
        >
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-[36px] h-[48px] text-center text-[20px] font-semibold bg-[#161823] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          ))}
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
            💡 <span className="font-semibold text-primary">Petunjuk:</span> Tanggal jadian kita ada di bulan ke-4 tahun 2023 (12042023)
          </div>
        )}

        {/* Submit Button fallback */}
        <button
          type="button"
          disabled={isValidating || digits.some((d) => !d)}
          onClick={() => validateDate(digits.join(""))}
          className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-[15px] active:scale-95 disabled:opacity-40 transition-all shadow-lg"
        >
          {isValidating ? "Membuka ForUs..." : "Mulai Buka Kenangan Kita ❤️"}
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 300ms ease-in-out;
        }
      `}</style>
    </div>
  );
}
