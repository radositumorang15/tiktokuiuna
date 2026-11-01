"use client";

import React, { useRef, useState, useEffect } from "react";
import { type FeedItem } from "@/content/feed";
import { useStore } from "@/lib/store";
import { wish } from "@/lib/wishes";
import { VolumeMuteIcon } from "@/components/icons/TikTokIcons";

interface VideoTileProps {
  item: FeedItem;
  isActive: boolean;
  onProgress?: (progress: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function VideoTile({
  item,
  isActive,
  onProgress,
  onPlayStateChange,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedSheet, setShowSpeedSheet] = useState(false);

  const muted = useStore((s) => s.muted);
  const addDoubleTapLike = useStore((s) => s.addDoubleTapLike);

  const lastTapRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // If item has custom audio, use it and mute video. Otherwise, video audio is the sound!
  const hasCustomAudio = Boolean(item.song?.audio);

  // Sync play/pause with active state
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      if (audio) audio.currentTime = 0;

      // If has custom audio, video is muted to prevent clash. Otherwise, video audio is unmuted according to global muted state.
      video.muted = hasCustomAudio ? true : muted;
      if (audio) audio.muted = muted;

      video
        .play()
        .then(() => {
          setIsPlaying(true);
          onPlayStateChange?.(true);
          if (hasCustomAudio && audio) {
            audio.play().catch(() => {});
          }
        })
        .catch(() => {
          // Autoplay policy prevented unmuted playback, sync muted state
          video.muted = true;
          if (audio) audio.muted = true;
          useStore.setState({ muted: true });
          video.play().catch(() => {});
          if (hasCustomAudio && audio) {
            audio.play().catch(() => {});
          }
          setIsPlaying(true);
          onPlayStateChange?.(true);
        });
    } else {
      video.pause();
      if (audio) audio.pause();
      setIsPlaying(false);
      onPlayStateChange?.(false);
    }
  }, [isActive, hasCustomAudio, muted, onPlayStateChange]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = hasCustomAudio ? true : muted;
    }
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted, hasCustomAudio]);

  // Update progress & sync audio loop
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video || !video.duration) return;
    onProgress?.(video.currentTime / video.duration);

    if (hasCustomAudio && audio && !audio.paused) {
      if (Math.abs(audio.currentTime - video.currentTime) > 0.35) {
        audio.currentTime = video.currentTime;
      }
    }
  };

  // Toggle Play/Pause on single tap vs double-tap detection
  const handlePointerDown = () => {
    // Start long-press timer (350ms)
    longPressTimerRef.current = setTimeout(() => {
      setShowSpeedSheet(true);
    }, 350);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    const now = Date.now();
    const timeSinceLast = now - lastTapRef.current;

    if (timeSinceLast < 280) {
      // Double tap detected!
      lastTapRef.current = 0;
      addDoubleTapLike(
        item.id,
        e.clientX,
        e.clientY,
        item.onLike?.effect,
        item.onLike?.payload
      );
      wish("doubleTap", { clipId: item.id });
    } else {
      // Potential single tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now && !showSpeedSheet) {
          togglePlay();
        }
      }, 290);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      if (hasCustomAudio && audio) {
        audio.play().catch(() => {});
      }
      setIsPlaying(true);
      onPlayStateChange?.(true);
      wish("pause");
    } else {
      video.pause();
      if (hasCustomAudio && audio) {
        audio.pause();
      }
      setIsPlaying(false);
      setShowPlayIcon(true);
      onPlayStateChange?.(false);
      setTimeout(() => setShowPlayIcon(false), 300);
      wish("pause");
    }
  };

  const handleSetSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    setShowSpeedSheet(false);
    if (newSpeed === 2) wish("speedUp");
    if (newSpeed === 0.5) wish("speedDown");
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      aria-label={isPlaying ? "Video sedang diputar" : "Video dijeda"}
      className="relative w-full h-full bg-black select-none overflow-hidden"
    >
      {/* Dev empty-slot placeholder or native video */}
      {item.isEmptyPlaceholder ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 text-center select-none">
          <div className="w-16 h-16 rounded-full bg-[#161823] border border-[#3a3a3a] flex items-center justify-center text-[28px] mb-3 text-primary">
            🎬
          </div>
          <h3 className="text-[16px] font-semibold text-white mb-1">
            Slot {item.slot} Kosong
          </h3>
          <p className="text-[13px] text-[#a8a8a8] max-w-[260px]">
            Taruh video di <code className="text-primary font-mono">content/media/{item.slot}/video.mp4</code> atau unggah lewat Studio.
          </p>
        </div>
      ) : (
        <>
          {/* Blurred background backdrop for landscape videos */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-2xl brightness-60 scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${item.poster || ""})` }}
          />

          {/* Native video element (plays video audio if no custom song is set) */}
          <video
            ref={videoRef}
            src={item.src}
            poster={item.poster}
            muted={hasCustomAudio ? true : muted}
            playsInline
            loop
            preload={isActive ? "auto" : "metadata"}
            onTimeUpdate={handleTimeUpdate}
            className="relative z-10 w-full h-full object-cover"
          />

          {/* Custom audio track (if set) */}
          {hasCustomAudio && item.song.audio && (
            <audio
              ref={audioRef}
              src={item.song.audio}
              loop
              preload={isActive ? "auto" : "none"}
              className="hidden"
            />
          )}
        </>
      )}

      {/* Floating TikTok-style unmute badge */}
      {isActive && muted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            useStore.getState().toggleMute();
            wish("unmute");
            if (videoRef.current) {
              videoRef.current.muted = hasCustomAudio ? true : false;
              videoRef.current.play().catch(() => {});
            }
            if (audioRef.current) {
              audioRef.current.muted = false;
              audioRef.current.play().catch(() => {});
            }
          }}
          aria-label="Nyalakan suara video"
          className="absolute left-4 z-30 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/20 text-white text-[12px] font-medium shadow-lg active:scale-95 transition-transform"
          style={{ top: "calc(64px + env(safe-area-inset-top, 0px))" }}
        >
          <VolumeMuteIcon size={16} className="text-[#fe2c55]" />
          <span>Ketuk untuk bersuara</span>
        </button>
      )}

      {/* 72px center pause icon flash */}
      {showPlayIcon && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-[72px] h-[72px] rounded-full bg-black/40 flex items-center justify-center text-white/80 animate-in zoom-in-75 duration-150">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Long-press Speed / Options Sheet */}
      {showSpeedSheet && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            e.stopPropagation();
            setShowSpeedSheet(false);
          }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[480px] rounded-t-2xl bg-[#1f1f1f] border-t border-[#3a3a3a] p-4 pb-8 space-y-4 animate-in slide-in-from-bottom duration-200"
            style={{ paddingBottom: "calc(20px + env(safe-area-inset-bottom, 0px))" }}
          >
            <div className="w-full flex justify-center">
              <div className="w-[36px] h-[4px] rounded-full bg-[#737373]" />
            </div>

            <h3 className="text-[14px] font-semibold text-[#a8a8a8] text-center">
              Kecepatan Video
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSetSpeed(s)}
                  className={`py-2.5 rounded-lg border text-[14px] font-semibold transition-colors ${
                    speed === s
                      ? "border-primary bg-primary text-white"
                      : "border-[#3a3a3a] bg-[#161823] text-white hover:border-white/50"
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowSpeedSheet(false);
                alert("Mustahil tidak tertarik, ini kisah kita! ❤️");
              }}
              className="w-full py-3 rounded-lg border border-[#3a3a3a] bg-[#161823] text-white/80 hover:text-white text-[14px] font-medium"
            >
              Tidak Tertarik (&quot;Mustahil, ini kita!&quot;)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
