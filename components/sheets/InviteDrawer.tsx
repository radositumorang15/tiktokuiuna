"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { siteConfig } from "@/content/site";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function InviteDrawer() {
  const isOpen = useStore((s) => s.isCreateOpen);
  const closeCreate = useStore((s) => s.closeCreate);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });

  // Choices in step 2
  const [food, setFood] = useState("Sushi & Ramen");
  const [place, setPlace] = useState("Kafe Cozy & Rooftop");
  const [time, setTime] = useState("Sabtu Malam (19.00)");

  if (!isOpen) return null;

  const handleDodge = () => {
    if (dodgeCount < 6) {
      setDodgeCount((prev) => prev + 1);
      const randX = (Math.random() - 0.5) * 160;
      const randY = (Math.random() - 0.5) * 100;
      setDodgeOffset({ x: randX, y: randY });
    } else {
      // 6 times dodged -> transforms into "Iya deh"
      setStep(2);
    }
  };

  const handleFinish = () => {
    setStep(3);
  };

  const summaryText = `Hai ${siteConfig.couple.me}! Ini jadwal kencan kita yang kupilih di ForUs ❤️\n- Menu: ${food}\n- Tempat: ${place}\n- Waktu: ${time}\nAku tunggu ya sayang! 🥰`;
  const waUrl = getWhatsAppUrl(siteConfig.whatsapp.number, summaryText);

  const handleClose = () => {
    setStep(1);
    setDodgeCount(0);
    setDodgeOffset({ x: 0, y: 0 });
    closeCreate();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ajak Kencan Kita"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-[16px] bg-[#161823] border-t border-[#3a3a3a] p-5 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200 min-h-[50dvh]"
        style={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="w-full flex justify-center pb-1">
          <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[12px] font-semibold text-primary uppercase tracking-wider">
            Petualangan Kita 💖
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Tutup"
            className="text-[#a8a8a8] hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Teaser */}
        {step === 1 && (
          <div className="py-6 flex flex-col items-center text-center space-y-4">
            <span className="text-[44px]">💌</span>
            <h2 className="text-[20px] leading-[28px] font-bold text-white">
              Kamu mau jalan-jalan bareng aku lagi?
            </h2>
            <p className="text-[14px] leading-[20px] text-[#a8a8a8] max-w-[280px]">
              Ada jadwal kencan rahasia yang sudah kusiapkan khusus buat kamu!
            </p>

            <div className="relative w-full flex items-center justify-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded bg-primary text-white font-semibold text-[15px] active:scale-95 transition-transform"
              >
                Mau Banget! ❤️
              </button>

              <button
                type="button"
                onMouseEnter={handleDodge}
                onTouchStart={handleDodge}
                onClick={dodgeCount >= 6 ? () => setStep(2) : handleDodge}
                style={{
                  transform: `translate(${dodgeOffset.x}px, ${dodgeOffset.y}px)`,
                  transition: "transform 0.15s ease-out",
                }}
                className="px-5 py-2.5 rounded border border-[#4a4a4a] text-white text-[15px] select-none"
              >
                {dodgeCount >= 6 ? "Iya deh 🥰" : "Nggak mau"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date choices */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <h2 className="text-[18px] font-bold text-white">
              Pilih Rencana Kencan Kita:
            </h2>

            {/* Food choice */}
            <div>
              <label className="text-[13px] text-[#a8a8a8] font-medium block mb-1.5">
                1. Mau makan apa nanti?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Sushi & Ramen", "Steak & Pasta", "Sate & Seafood", "Masak Bareng"].map(
                  (opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFood(opt)}
                      className={`p-2.5 text-[13px] rounded-lg border text-left transition-colors ${
                        food === opt
                          ? "border-primary bg-primary/20 text-white font-semibold"
                          : "border-[#3a3a3a] bg-[#1f1f1f] text-[#a8a8a8]"
                      }`}
                    >
                      {opt}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Place choice */}
            <div>
              <label className="text-[13px] text-[#a8a8a8] font-medium block mb-1.5">
                2. Suasana tempatnya?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Kafe Cozy & Rooftop",
                  "Bioskop & Mall",
                  "Taman / Pantai Senja",
                  "Netflix & Chill di Rumah",
                ].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPlace(opt)}
                    className={`p-2.5 text-[13px] rounded-lg border text-left transition-colors ${
                      place === opt
                        ? "border-primary bg-primary/20 text-white font-semibold"
                        : "border-[#3a3a3a] bg-[#1f1f1f] text-[#a8a8a8]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Time choice */}
            <div>
              <label className="text-[13px] text-[#a8a8a8] font-medium block mb-1.5">
                3. Kapan waktunya?
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] text-white text-[14px]"
              >
                <option value="Jumat Sore (17.00)">Jumat Sore (17.00)</option>
                <option value="Sabtu Malam (19.00)">Sabtu Malam (19.00)</option>
                <option value="Minggu Pagi (09.00)">Minggu Pagi (09.00)</option>
                <option value="Kapanpun kamu siap!">Kapanpun kamu siap!</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-[15px] mt-2 active:scale-95 transition-transform"
            >
              Kunci Jadwal Ini ✨
            </button>
          </div>
        )}

        {/* Step 3: Summary + WhatsApp share */}
        {step === 3 && (
          <div className="py-4 space-y-4 text-center">
            <span className="text-[40px]">🎉</span>
            <h2 className="text-[18px] font-bold text-white">
              Jadwal Kencan Kita Sudah Siap!
            </h2>

            <div className="p-4 rounded-xl bg-[#1f1f1f] border border-[#3a3a3a] text-left text-[14px] leading-[22px] space-y-1.5">
              <p className="text-white">
                <span className="text-[#a8a8a8]">Menu:</span> {food}
              </p>
              <p className="text-white">
                <span className="text-[#a8a8a8]">Tempat:</span> {place}
              </p>
              <p className="text-white">
                <span className="text-[#a8a8a8]">Waktu:</span> {time}
              </p>
            </div>

            <p className="text-[13px] text-[#a8a8a8]">
              Kirim jadwal ini ke WhatsApp-ku biar langsung kupersiapkan ya sayang!
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-primary text-white font-semibold text-[15px] active:scale-95 transition-transform"
            >
              <span>Kirim ke WhatsApp Aku</span>
              <span>💬</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

