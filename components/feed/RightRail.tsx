"use client";

import React, { useState } from "react";
import {
  HeartIcon,
  CommentIcon,
  SaveIcon,
  ShareIcon,
  RepostIcon,
} from "@/components/icons/TikTokIcons";
import { formatCount } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";
import { type FeedItem } from "@/content/feed";

interface RightRailProps {
  item: FeedItem;
  isPlaying: boolean;
  onRepostFlight?: () => void;
}

export function RightRail({ item, isPlaying, onRepostFlight }: RightRailProps) {
  const [followAnimating, setFollowAnimating] = useState(false);
  const liked = useStore((s) => s.liked.includes(item.id));
  const saved = useStore((s) => s.saves.includes(item.id));
  const reposted = useStore((s) => s.reposts.includes(item.id));
  const followed = useStore((s) => s.followed);

  const toggleLike = useStore((s) => s.toggleLike);
  const toggleSave = useStore((s) => s.toggleSave);
  const repostClip = useStore((s) => s.repostClip);
  const setFollowed = useStore((s) => s.setFollowed);
  const openComments = useStore((s) => s.openComments);
  const openShare = useStore((s) => s.openShare);
  const openSongSheet = useStore((s) => s.openSongSheet);
  const triggerRepostGlitch = useStore((s) => s.triggerRepostGlitch);

  // Dynamic counts based on base + user action
  const likesCount = item.baseCounts.likes + (liked ? 1 : 0);
  const commentsCount = item.baseCounts.comments + (useStore.getState().userComments[item.id]?.length || 0);
  const savesCount = item.baseCounts.saves + (saved ? 1 : 0);
  const repostsCount = item.baseCounts.reposts + (reposted ? 1 : 0);
  const sharesCount = item.baseCounts.shares;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willLike = toggleLike(item.id, item.onLike?.effect, item.onLike?.payload);
    if (willLike) {
      wish("like", { clipId: item.id, clipTitle: item.caption });
    }
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    wish("commentOpen", { clipId: item.id, clipTitle: item.caption });
    openComments(item.id);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const willSave = toggleSave(item.id);
    if (willSave) {
      wish("save", { clipId: item.id, clipTitle: item.caption });
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    wish("share", { clipId: item.id, clipTitle: item.caption });
    openShare(item.id);
  };

  const handleRepostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNewRepost = repostClip(item.id);
    onRepostFlight?.();
    triggerRepostGlitch();
    if (isNewRepost) {
      wish("repost", { clipId: item.id, clipTitle: item.caption });
    }
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!followed) {
      setFollowAnimating(true);
      setTimeout(() => {
        setFollowed(true);
        setFollowAnimating(false);
      }, 400);
      wish("follow");
    }
  };

  const handleDiscClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    wish("musicDisc", { clipId: item.id, clipTitle: item.song.title });
    openSongSheet(item.id);
  };

  return (
    <aside
      className="absolute right-[12px] z-30 flex flex-col items-center gap-[16px] pointer-events-auto"
      style={{
        bottom: "calc(96px + env(safe-area-inset-bottom, 0px))",
      }}
      aria-label="Interaksi klip"
    >
      {/* 1. Creator Avatar (48px, 1.5px border, magenta + badge) */}
      <div className="relative mb-1 flex items-center justify-center">
        <div
          className={`w-[48px] h-[48px] rounded-full border-[1.5px] border-white overflow-hidden bg-[#161823] transition-transform duration-300 ${
            followAnimating ? "scale-110" : "scale-100"
          }`}
        >
          <img
            src="/avatars/creator.jpg"
            alt="Creator Avatar"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' fill='%23fe2c55'%3E%3Crect width='48' height='48' fill='%231f1f1f'/%3E%3Ccircle cx='24' cy='18' r='10' fill='%23fe2c55'/%3E%3Cpath d='M8 42c0-8.8 7.2-16 16-16s16 7.2 16 16H8z' fill='%23fe2c55'/%3E%3C/svg%3E";
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Follow Badge */}
        {!followed && (
          <button
            type="button"
            onClick={handleFollowClick}
            aria-label="Ikuti kreator"
            className={`absolute -bottom-[10px] left-1/2 -translate-x-1/2 flex items-center justify-center w-[20px] h-[20px] rounded-full bg-primary text-white shadow-md transition-all duration-300 ${
              followAnimating ? "scale-0 rotate-180" : "scale-100"
            }`}
          >
            <span className="text-[14px] font-bold leading-none">+</span>
          </button>
        )}
      </div>

      {/* 2. Like (Heart) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleLikeClick}
          aria-label={liked ? "Batal suka" : "Suka video ini"}
          className="flex items-center justify-center w-[48px] h-[48px] active:scale-90 transition-transform rail-drop-shadow"
        >
          <HeartIcon
            size={32}
            filled={liked}
            className={liked ? "text-[#fe2c55]" : "text-white"}
          />
        </button>
        <span className="text-[13px] leading-[18px] font-medium text-white select-none rail-drop-shadow">
          {formatCount(likesCount)}
        </span>
      </div>

      {/* 3. Comment */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleCommentClick}
          aria-label="Buka komentar"
          className="flex items-center justify-center w-[48px] h-[48px] text-white active:scale-90 transition-transform rail-drop-shadow"
        >
          <CommentIcon size={32} />
        </button>
        <span className="text-[13px] leading-[18px] font-medium text-white select-none rail-drop-shadow">
          {formatCount(commentsCount)}
        </span>
      </div>

      {/* 4. Save (Bookmark) */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={saved ? "Hapus dari tersimpan" : "Simpan video"}
          className="flex items-center justify-center w-[48px] h-[48px] active:scale-90 transition-transform rail-drop-shadow"
        >
          <SaveIcon
            size={32}
            filled={saved}
            className={saved ? "text-white" : "text-white"}
          />
        </button>
        <span className="text-[13px] leading-[18px] font-medium text-white select-none rail-drop-shadow">
          {formatCount(savesCount)}
        </span>
      </div>

      {/* 5. Share */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleShareClick}
          aria-label="Bagikan ke WhatsApp"
          className="flex items-center justify-center w-[48px] h-[48px] text-white active:scale-90 transition-transform rail-drop-shadow"
        >
          <ShareIcon size={32} />
        </button>
        <span className="text-[13px] leading-[18px] font-medium text-white select-none rail-drop-shadow">
          {formatCount(sharesCount)}
        </span>
      </div>

      {/* 6. Repost */}
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={handleRepostClick}
          aria-label="Repost ke profil kamu"
          className="flex items-center justify-center w-[48px] h-[48px] active:scale-90 transition-transform rail-drop-shadow"
        >
          <RepostIcon
            size={32}
            filled={reposted}
            className={reposted ? "text-primary" : "text-white"}
          />
        </button>
        <span className="text-[13px] leading-[18px] font-medium text-white select-none rail-drop-shadow">
          {formatCount(repostsCount)}
        </span>
      </div>

      {/* 7. Music Disc (40px, spins 6s, stops when paused) */}
      <div className="flex items-center justify-center pt-2">
        <button
          type="button"
          onClick={handleDiscClick}
          aria-label="Detail lagu kita"
          className={`relative flex items-center justify-center w-[40px] h-[40px] rounded-full border border-[#3a3a3a] bg-gradient-to-tr from-[#161823] to-[#000000] rail-drop-shadow active:scale-95 transition-transform ${
            isPlaying ? "animate-spin-disc" : "paused"
          }`}
        >
          {/* Inner ring */}
          <div className="w-[24px] h-[24px] rounded-full overflow-hidden bg-[#252525] flex items-center justify-center border border-black">
            <img
              src={item.song.cover}
              alt={item.song.title}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'%3E%3Ccircle cx='12' cy='12' r='10' fill='%231f1f1f'/%3E%3Ccircle cx='12' cy='12' r='3' fill='%23fe2c55'/%3E%3C/svg%3E";
              }}
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>
    </aside>
  );
}
