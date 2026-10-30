import { defaultSlots, type ContentSlot } from "./slots";
import manifestData from "./manifest.json";
import slotsJsonData from "./slots.json";
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

export function getFeedItems(
  isDev: boolean = process.env.NODE_ENV !== "production",
  customSlots?: ContentSlot[]
): FeedItem[] {
  const manifestSlots = (manifestData?.slots || {}) as Record<string, ManifestSlot>;
  const sourceSlots: ContentSlot[] = customSlots || (slotsJsonData as ContentSlot[]) || defaultSlots;
  const items: FeedItem[] = [];

  for (const slot of sourceSlots) {
    const manifestMedia = manifestSlots[slot.id];

    // Check direct media on slot (from uploader/CRUD) first
    const hasDirectVideo = slot.type === "video" && !!slot.src;
    const hasDirectPhotos =
      (slot.type === "photo-carousel" || slot.type === "photo-slideshow") &&
      !!slot.photos &&
      slot.photos.length > 0;

    // Check manifest media fallback
    const hasManifestMedia =
      !!manifestMedia &&
      ((manifestMedia.type === "video" && !!manifestMedia.src) ||
        (manifestMedia.type === "photo" && !!manifestMedia.files?.length));

    const hasMedia = hasDirectVideo || hasDirectPhotos || hasManifestMedia;

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

    if (slot.type === "video") {
      items.push({
        id: slot.id,
        slot: slot.id,
        type: "video",
        src: slot.src || manifestMedia?.src,
        poster: slot.poster || manifestMedia?.poster || "",
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
      // Photo Carousel / Slideshow
      const photos =
        hasDirectPhotos && slot.photos
          ? slot.photos.map((p, idx) => ({
              src: p.src,
              caption: p.caption || `${slot.caption} (${idx + 1}/${slot.photos?.length})`,
            }))
          : (manifestMedia?.files || []).map((fileSrc, idx) => ({
              src: fileSrc,
              caption: `${slot.caption} (${idx + 1}/${manifestMedia?.files?.length})`,
            }));

      items.push({
        id: slot.id,
        slot: slot.id,
        type: "photo",
        photos,
        poster: slot.poster || manifestMedia?.poster || photos[0]?.src || "",
        photoMode: slot.photoMode || (slot.type === "photo-slideshow" ? "slideshow" : "swipe"),
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
