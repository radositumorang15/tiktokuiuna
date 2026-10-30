"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MusicNoteIcon } from "@/components/icons/TikTokIcons";
import { siteConfig } from "@/content/site";
import { type FeedItem } from "@/content/feed";

interface CaptionOverlayProps {
  item: FeedItem;
}

export function CaptionOverlay({ item }: CaptionOverlayProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="absolute left-[12px] z-30 flex flex-col pointer-events-auto"
      style={{
        bottom: "calc(72px + env(safe-area-inset-bottom, 0px))",
        maxWidth: "calc(100% - 12px - 76px)",
      }}
    >
      {/* 1. Username (15/22/600) */}
      <div className="mb-1">
        <Link
          href="/profile"
          className="text-[15px] leading-[22px] font-semibold text-white hover:underline transition-all active:opacity-75"
        >
          @{siteConfig.couple.myUsername}
        </Link>
      </div>

      {/* 2. Description (15/22/400) + Hashtags (white 600) */}
      <div className="mb-2">
        <p
          className={`text-[15px] leading-[22px] font-normal text-white ${
            isExpanded ? "" : "line-clamp-2"
          }`}
        >
          {item.caption}{" "}
          {item.hashtags?.map((tag) => (
            <span key={tag} className="font-semibold text-white mr-1.5 inline-block">
              #{tag}
            </span>
          ))}
        </p>

        {!isExpanded && item.caption.length > 50 && (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-[14px] font-medium text-[#a8a8a8] mt-0.5 inline-block active:opacity-75"
          >
            selengkapnya
          </button>
        )}
      </div>

      {/* 3. Music Row: ♪ icon + marquee song title (12s loop) 14/20 */}
      <div className="flex items-center gap-2 overflow-hidden max-w-[240px]">
        <MusicNoteIcon size={14} className="text-white shrink-0" />
        <div className="relative overflow-hidden w-full h-[20px] flex items-center">
          <div className="animate-marquee">
            <span className="text-[14px] leading-[20px] font-normal text-white mr-8 select-none">
              {item.song.title} — {item.song.artist}
            </span>
            <span className="text-[14px] leading-[20px] font-normal text-white mr-8 select-none">
              {item.song.title} — {item.song.artist}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
