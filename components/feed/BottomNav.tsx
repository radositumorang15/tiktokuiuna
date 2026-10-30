"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  TemanIcon,
  InboxIcon,
  ProfileIcon,
  CreateButton,
} from "@/components/icons/TikTokIcons";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";

interface BottomNavProps {
  isHomeOverlay?: boolean;
}

export function BottomNav({ isHomeOverlay = false }: BottomNavProps) {
  const pathname = usePathname();
  const openCreate = useStore((s) => s.openCreate);
  const repostGlitchTarget = useStore((s) => s.repostGlitchTarget);
  const repostsCount = useStore((s) => s.reposts.length);

  const isHome = pathname === "/feed" || pathname === "/" || pathname === "";
  const isTeman = pathname === "/teman";
  const isInbox = pathname === "/inbox";
  const isProfile = pathname === "/profile";

  const handleCreateClick = () => {
    wish("create");
    openCreate();
  };

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-200 border-t border-[#3a3a3a] ${
        isHome && isHomeOverlay
          ? "bg-transparent backdrop-blur-[2px]"
          : "bg-black"
      }`}
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-[56px] max-w-[480px] mx-auto px-2">
        {/* 1. Home */}
        <Link
          href="/feed"
          onClick={() => isHome && wish("open")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isHome ? "text-white" : "text-[#a8a8a8] hover:text-white"
          }`}
        >
          <HomeIcon filled={isHome} size={24} />
          <span className="text-[12px] leading-[16px] mt-0.5 font-medium">Home</span>
        </Link>

        {/* 2. Teman ("Kita") */}
        <Link
          href="/teman"
          onClick={() => wish("open")}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isTeman ? "text-white" : "text-[#a8a8a8] hover:text-white"
          }`}
        >
          <TemanIcon filled={isTeman} size={24} />
          <span className="text-[12px] leading-[16px] mt-0.5 font-medium">Teman</span>
        </Link>

        {/* 3. Create (＋) */}
        <div className="flex items-center justify-center flex-1 py-1">
          <CreateButton onClick={handleCreateClick} />
        </div>

        {/* 4. Inbox */}
        <Link
          href="/inbox"
          onClick={() => wish("inbox")}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            isInbox ? "text-white" : "text-[#a8a8a8] hover:text-white"
          }`}
        >
          <div className="relative">
            <InboxIcon filled={isInbox} size={24} />
            {/* Magenta badge with count 3 */}
            <span className="absolute -top-1 -right-2 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-[#fe2c55] text-white text-[11px] font-semibold">
              3
            </span>
          </div>
          <span className="text-[12px] leading-[16px] mt-0.5 font-medium">Inbox</span>
        </Link>

        {/* 5. Profil */}
        <Link
          href="/profile"
          id="profile-nav-icon"
          onClick={() => wish("profile")}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            isProfile ? "text-white" : "text-[#a8a8a8] hover:text-white"
          } ${repostGlitchTarget ? "scale-125 animate-bounce" : ""}`}
        >
          <div className="relative">
            <ProfileIcon filled={isProfile} size={24} />
            {repostsCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-[8px] h-[8px] rounded-full bg-[#fe2c55]" />
            )}
          </div>
          <span className="text-[12px] leading-[16px] mt-0.5 font-medium">Profil</span>
        </Link>
      </div>
    </footer>
  );
}
