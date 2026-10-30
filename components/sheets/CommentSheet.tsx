"use client";

import React, { useState } from "react";
import { useStore, type UserComment } from "@/lib/store";
import { defaultSlots } from "@/content/slots";
import { wish } from "@/lib/wishes";
import { siteConfig } from "@/content/site";

const EMPTY_COMMENTS: UserComment[] = [];

export function CommentSheet() {
  const isOpen = useStore((s) => s.isCommentOpen);
  const clipId = useStore((s) => s.activeCommentClipId);
  const closeComments = useStore((s) => s.closeComments);
  const addComment = useStore((s) => s.addComment);
  const allUserComments = useStore((s) => s.userComments);
  const userComments = clipId && allUserComments[clipId] ? allUserComments[clipId] : EMPTY_COMMENTS;

  const [commentInput, setCommentInput] = useState("");
  const [isTypingReply, setIsTypingReply] = useState(false);
  const [replies, setReplies] = useState<{ id: string; user: string; text: string; time: string }[]>([]);

  if (!isOpen || !clipId) return null;

  const currentSlot = defaultSlots.find((s) => s.id === clipId);
  const seededComments = currentSlot?.comments || [];
  const allComments = [...userComments, ...seededComments];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const text = commentInput.trim();
    addComment(clipId, text);
    setCommentInput("");
    wish("commentSend", { clipId });

    // Auto-reply simulation if slot has autoReply
    if (currentSlot?.autoReply) {
      setIsTypingReply(true);
      setTimeout(() => {
        setIsTypingReply(false);
        setReplies((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            user: siteConfig.couple.myUsername,
            text: currentSlot.autoReply!.text,
            time: "Baru saja",
          },
        ]);
      }, currentSlot.autoReply.delayMs || 1200);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Komentar"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in duration-300"
      onClick={closeComments}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] h-[70dvh] rounded-t-[12px] bg-[#1f1f1f] flex flex-col relative animate-in slide-in-from-bottom duration-300"
      >
        {/* Drag handle 36x4 */}
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
        </div>

        {/* Header: N komentar centered + close button right */}
        <div className="relative flex items-center justify-center px-4 py-2 border-b border-[#3a3a3a]">
          <h2 className="text-[15px] font-semibold text-white">
            {allComments.length + replies.length} komentar
          </h2>
          <button
            type="button"
            onClick={closeComments}
            aria-label="Tutup komentar"
            className="absolute right-4 text-[#a8a8a8] hover:text-white p-1 text-[16px]"
          >
            ✕
          </button>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Scripted creator auto-replies */}
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 items-start animate-in fade-in duration-300">
              <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-primary shrink-0 border border-white">
                <img
                  src="/avatars/creator.jpg"
                  alt="Creator"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23fe2c55'/%3E%3C/svg%3E";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#a8a8a8]">
                    @{reply.user}
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded border border-primary text-primary font-semibold">
                    Pembuat
                  </span>
                </div>
                <p className="text-[15px] leading-[22px] text-white mt-0.5">
                  {reply.text}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-[#737373]">
                  <span>{reply.time}</span>
                  <button type="button" className="hover:text-white">Balas</button>
                </div>
              </div>
              <span className="text-[14px] text-primary">❤️</span>
            </div>
          ))}

          {/* Typing indicator */}
          {isTypingReply && (
            <div className="flex gap-3 items-center text-[#a8a8a8] text-[13px] italic animate-pulse">
              <div className="w-[36px] h-[36px] rounded-full bg-primary/40 flex items-center justify-center text-[10px] text-white">
                ...
              </div>
              <span>@{siteConfig.couple.myUsername} sedang mengetik balasan...</span>
            </div>
          )}

          {/* All comments */}
          {allComments.map((c, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-[36px] h-[36px] rounded-full overflow-hidden bg-[#2a2a2a] shrink-0 border border-white/20">
                <img
                  src={c.creator ? "/avatars/creator.jpg" : "/avatars/user.jpg"}
                  alt={c.user}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%234a4a4a'/%3E%3C/svg%3E";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#a8a8a8]">
                    @{c.user}
                  </span>
                  {c.creator && (
                    <span className="text-[10px] px-1 py-0.5 rounded border border-primary text-primary font-semibold">
                      Pembuat
                    </span>
                  )}
                </div>
                <p className="text-[15px] leading-[22px] text-white mt-0.5">
                  {c.text}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[12px] text-[#737373]">
                  <span>{c.time}</span>
                  <button type="button" className="hover:text-white">Balas</button>
                </div>
              </div>

              <button
                type="button"
                aria-label="Suka komentar"
                className="text-[#737373] hover:text-primary transition-colors p-1"
              >
                ♡
              </button>
            </div>
          ))}
        </div>

        {/* Pinned input row at bottom */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-[#3a3a3a] bg-[#161823] flex items-center gap-2"
          style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="w-[36px] h-[36px] rounded-full bg-[#3a3a3a] overflow-hidden shrink-0">
            <img
              src="/avatars/user.jpg"
              alt="You"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Ccircle cx='18' cy='18' r='18' fill='%23737373'/%3E%3C/svg%3E";
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Tambah komentar untuk kita..."
            className="flex-1 h-[40px] px-4 rounded-full bg-[#1f1f1f] text-white placeholder-[#737373] text-[14px] border border-[#3a3a3a] focus:outline-none focus:border-white/50"
          />

          <button
            type="submit"
            aria-label="Kirim komentar"
            disabled={!commentInput.trim()}
            className="w-[40px] h-[40px] rounded-full bg-primary text-white flex items-center justify-center shrink-0 disabled:opacity-40 transition-opacity active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

