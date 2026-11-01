"use client";

import React from "react";
import Link from "next/link";
import { LiveDot, SearchIcon, VolumeIcon, VolumeMuteIcon } from "@/components/icons/TikTokIcons";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";

interface TopBarProps {
  activeTab?: "mengikuti" | "untukkita";
  onTabChange?: (tab: "mengikuti" | "untukkita") => void;
  showBanner?: boolean;
}

export function TopBar({
  activeTab = "untukkita",
  onTabChange,
  showBanner = true,
}: TopBarProps) {
  const muted = useStore((s) => s.muted);
  const toggleMute = useStore((s) => s.toggleMute);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willBeMuted = !muted;
    toggleMute();
    wish(willBeMuted ? "mute" : "unmute");

    // Immediately unmute media elements within this user gesture
    if (!willBeMuted) {
      document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
        v.muted = false;
        v.play().catch(() => {});
      });
      document.querySelectorAll<HTMLAudioElement>("audio").forEach((a) => {
        a.muted = false;
        a.play().catch(() => {});
      });
    }
  };

  const handleTabClick = (tab: "mengikuti" | "untukkita") => {
    onTabChange?.(tab);
    if (tab === "mengikuti") {
      wish("follow");
    }
  };

  const handleSearchClick = () => {
    wish("search");
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-auto">
      {/* 120px top gradient scrim */}
      <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none -z-10" />

      {/* Optional Birthday mini-badge */}
      {showBanner && (
        <div className="w-full flex justify-center pt-1 pb-0.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-sm">
            <span className="text-[11px] leading-[14px] text-white font-medium">
              Hari ini ulang tahun kamu 🎂
            </span>
          </div>
        </div>
      )}

      {/* Main Top Bar: 52px height + safe-area */}
      <div
        className="flex items-center justify-between px-4 h-[52px]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        {/* Left: Decorative LIVE icon */}
        <div className="min-w-[64px] flex items-center justify-start">
          <button
            type="button"
            aria-label="LIVE kita"
            onClick={() => wish("open")}
            className="flex items-center justify-center p-1 text-white opacity-90 active:opacity-60"
          >
            <LiveDot />
          </button>
        </div>

        {/* Center: Tabs Mengikuti | Untuk Kita (Tab gap 24px, 16/22/600) */}
        <nav className="flex items-center gap-6" aria-label="Kategori feed">
          <button
            type="button"
            onClick={() => handleTabClick("mengikuti")}
            className={`text-[16px] leading-[22px] font-semibold transition-colors duration-150 ${
              activeTab === "mengikuti" ? "text-white" : "text-[#a8a8a8] hover:text-white"
            }`}
          >
            Mengikuti
          </button>

          <div className="relative flex flex-col items-center">
            <button
              type="button"
              onClick={() => handleTabClick("untukkita")}
              className={`text-[16px] leading-[22px] font-semibold transition-colors duration-150 ${
                activeTab === "untukkita" ? "text-white" : "text-[#a8a8a8] hover:text-white"
              }`}
            >
              Untuk Kita
            </button>
            {activeTab === "untukkita" && (
              <span
                aria-hidden="true"
                className="absolute -bottom-[6px] w-[24px] h-[2px] bg-white rounded-full"
              />
            )}
          </div>
        </nav>

        {/* Right: Search icon */}
        <div className="min-w-[64px] flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
            className="p-1 text-white active:scale-90 transition-transform flex items-center justify-center rounded-full hover:bg-white/10"
          >
            {muted ? (
              <VolumeMuteIcon size={22} className="text-[#fe2c55]" />
            ) : (
              <VolumeIcon size={22} className="text-white" />
            )}
          </button>
          <Link
            href="/discover"
            onClick={handleSearchClick}
            aria-label="Cari kenangan"
            className="p-1 text-white opacity-90 active:opacity-60 transition-opacity"
          >
            <SearchIcon size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}

