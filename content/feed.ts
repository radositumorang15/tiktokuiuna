import { defaultSlots, type ContentSlot } from "./slots";
import manifestData from "./manifest.json";
import { type LikeEffect } from "./site";

export type FeedItem = {
  id: string;
  slot: string;
  type: "video" | "photo";
  src?: string;
  poster: string;
  photos?: { src: string; caption?: string }[];
  photoMode?: "swipe" | "slideshow";
  photoStyle?: "plain" | "kenburns" | "polaroid" | "stack";
  secondsPerPhoto?: number;
  caption: string;
  hashtags?: string[];
  song: {
    title: string;
    artist: string;
    cover: string;
    audio?: string;
  };
  baseCounts: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
    reposts: number;
  };
  onLike?: {
    effect: LikeEffect;
    payload?: {
      text?: string;
      audio?: string;
      from?: string;
    };
  };
  comments: {
    user: string;
    text: string;
    creator?: boolean;
    time: string;
  }[];
  autoReply?: {
    text: string;
    delayMs?: number;
  };
  hidden?: boolean;
  wish?: string;
  isEmptyPlaceholder?: boolean;
};

type ManifestSlot = {
  type: "video" | "photo";
  src?: string;
  poster?: string;
  files?: string[];
  width?: number;
  height?: number;
};

export function getFeedItems(isDev: boolean = process.env.NODE_ENV !== "production"): FeedItem[] {
  const manifestSlots = (manifestData?.slots || {}) as Record<string, ManifestSlot>;
  const items: FeedItem[] = [];

  for (const slot of defaultSlots) {
    const media = manifestSlots[slot.id];
    const hasMedia = !!media && ((media.type === "video" && !!media.src) || (media.type === "photo" && !!media.files?.length));

    if (!hasMedia) {
      if (isDev) {
        // Dev placeholder
        items.push({
          id: slot.id,
          slot: slot.id,
          type: slot.type === "video" ? "video" : "photo",
          poster: "",
          caption: slot.caption,
          hashtags: slot.hashtags,
          song: slot.song,
          baseCounts: slot.baseCounts,
          onLike: slot.onLike,
          comments: slot.comments,
          autoReply: slot.autoReply,
          hidden: slot.hidden,
          wish: slot.wish,
          photoMode: slot.photoMode,
          photoStyle: slot.photoStyle,
          secondsPerPhoto: slot.secondsPerPhoto,
          isEmptyPlaceholder: true,
        });
      }
      // In production, empty slots are skipped
      continue;
    }

    if (media.type === "video") {
      items.push({
        id: slot.id,
        slot: slot.id,
        type: "video",
        src: media.src,
        poster: media.poster || "",
        caption: slot.caption,
        hashtags: slot.hashtags,
        song: slot.song,
        baseCounts: slot.baseCounts,
        onLike: slot.onLike,
        comments: slot.comments,
        autoReply: slot.autoReply,
        hidden: slot.hidden,
        wish: slot.wish,
      });
    } else {
      items.push({
        id: slot.id,
        slot: slot.id,
        type: "photo",
        photos: (media.files || []).map((fileSrc, idx) => ({
          src: fileSrc,
          caption: `${slot.caption} (${idx + 1}/${media.files?.length})`,
        })),
        poster: media.poster || media.files?.[0] || "",
        photoMode: slot.photoMode || "swipe",
        photoStyle: slot.photoStyle || "plain",
        secondsPerPhoto: slot.secondsPerPhoto || 3,
        caption: slot.caption,
        hashtags: slot.hashtags,
        song: slot.song,
        baseCounts: slot.baseCounts,
        onLike: slot.onLike,
        comments: slot.comments,
        autoReply: slot.autoReply,
        hidden: slot.hidden,
        wish: slot.wish,
      });
    }
  }

  return items;
}

