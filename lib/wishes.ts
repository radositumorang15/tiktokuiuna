import { siteConfig, type WishAction } from "@/content/site";
import { useStore } from "./store";

export type ActiveWish = {
  id: string;
  text: string;
  iconType: "cake" | "heart" | "candle" | "sparkles";
};

type WishListener = (wish: ActiveWish | null) => void;
const listeners: Set<WishListener> = new Set();

let lastWishTime = 0;
let queuedWish: { action: WishAction; ctx?: { clipId?: string; n?: number; clipTitle?: string } } | null = null;
let queueTimer: NodeJS.Timeout | null = null;
let hideTimer: NodeJS.Timeout | null = null;

export function subscribeWish(listener: WishListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyWish(wish: ActiveWish | null) {
  listeners.forEach((fn) => fn(wish));
}

export function calculateDaysTogether(): number {
  try {
    const start = new Date(siteConfig.couple.anniversary).getTime();
    const now = Date.now();
    const diff = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
    return isNaN(diff) ? 365 : diff;
  } catch {
    return 365;
  }
}

export function replacePlaceholders(
  template: string,
  ctx?: { clipId?: string; n?: number; clipTitle?: string }
): string {
  const daysTogether = calculateDaysTogether();
  const nama = siteConfig.couple.her || "Sayang";
  const umur = siteConfig.birthday.turning || 24;
  const n = ctx?.n !== undefined ? ctx.n.toString() : "1";
  const judul = ctx?.clipTitle || "momen ini";

  return template
    .replace(/\{nama\}/g, nama)
    .replace(/\{umur\}/g, umur.toString())
    .replace(/\{hari_bersama\}/g, daysTogether.toString())
    .replace(/\{n\}/g, n)
    .replace(/\{judul_klip\}/g, judul);
}

function getIconForAction(action: WishAction): "cake" | "heart" | "candle" | "sparkles" {
  if (action === "finale" || action === "open" || action === "gate") return "cake";
  if (action === "like" || action === "doubleTap" || action === "repost" || action === "follow") return "heart";
  if (action === "idle" || action === "pause") return "candle";
  return "sparkles";
}

function processWish(action: WishAction, ctx?: { clipId?: string; n?: number; clipTitle?: string }) {
  const store = useStore.getState();
  if (!store.wishesEnabled) return;

  // Check prefers-reduced-motion
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Disabled under prefers-reduced-motion as per spec
    return;
  }

  const specialWish = ctx?.clipId ? siteConfig.birthday.wishes.special?.[ctx.clipId] : null;
  const pool = siteConfig.birthday.wishes.pools[action] || [];

  let rawWishText = "";
  if (specialWish) {
    rawWishText = specialWish;
  } else if (pool.length > 0) {
    const cursor = store.getAndIncrementWishCursor(action, pool.length);
    rawWishText = pool[cursor] || pool[0];
  } else {
    rawWishText = `Selamat ulang tahun, ${siteConfig.couple.her}! ❤️`;
  }

  const text = replacePlaceholders(rawWishText, ctx);
  const truncatedText = text.length > 90 ? text.slice(0, 87) + "..." : text;

  const activeWish: ActiveWish = {
    id: `wish-${Date.now()}`,
    text: truncatedText,
    iconType: getIconForAction(action),
  };

  lastWishTime = Date.now();
  notifyWish(activeWish);

  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    notifyWish(null);
  }, 2800); // 200ms in + 2600ms hold
}

export function wish(action: WishAction, ctx?: { clipId?: string; n?: number; clipTitle?: string }) {
  const minGapMs = siteConfig.birthday.wishes.minGapMs || 4000;
  const now = Date.now();
  const timeSinceLast = now - lastWishTime;

  if (timeSinceLast >= minGapMs) {
    processWish(action, ctx);
  } else {
    // Throttle: replace any existing queued wish with this newer action
    queuedWish = { action, ctx };

    if (!queueTimer) {
      const waitTime = minGapMs - timeSinceLast;
      queueTimer = setTimeout(() => {
        queueTimer = null;
        if (queuedWish) {
          const item = queuedWish;
          queuedWish = null;
          processWish(item.action, item.ctx);
        }
      }, waitTime);
    }
  }
}

