import { describe, it, expect } from "vitest";
import { replacePlaceholders, calculateDaysTogether } from "../lib/wishes";
import { formatCount } from "../lib/utils";
import { siteConfig, type WishAction } from "../content/site";
import { sha256 } from "../lib/hash";

describe("Wishes Engine", () => {
  it("replaces placeholders properly", () => {
    const template = "Happy birthday {nama}, umur {umur}! Sudah {hari_bersama} hari bersama.";
    const result = replacePlaceholders(template);
    expect(result).toContain(siteConfig.couple.her);
    expect(result).toContain(siteConfig.birthday.turning.toString());
    expect(result).not.toContain("{nama}");
    expect(result).not.toContain("{umur}");
    expect(result).not.toContain("{hari_bersama}");
  });

  it("ensures all 24 wish actions have at least 5 variants", () => {
    const requiredActions: WishAction[] = [
      "open", "gate", "like", "doubleTap", "repost", "commentOpen", "commentSend",
      "follow", "save", "share", "musicDisc", "speedUp", "speedDown", "pause",
      "mute", "unmute", "clipAdvance", "inbox", "profile", "search", "create",
      "easterEgg", "idle", "finale"
    ];

    for (const action of requiredActions) {
      const pool = siteConfig.birthday.wishes.pools[action];
      expect(pool, `Missing action pool: ${action}`).toBeDefined();
      expect(pool.length, `Action ${action} should have at least 5 variants`).toBeGreaterThanOrEqual(5);

      for (const wish of pool) {
        expect(wish.length, `Wish in ${action} exceeds 90 characters: "${wish}"`).toBeLessThanOrEqual(90);
      }
    }
  });

  it("calculates positive days together", () => {
    const days = calculateDaysTogether();
    expect(days).toBeGreaterThan(0);
  });
});

describe("Utils & Formatter", () => {
  it("formats counts properly", () => {
    expect(formatCount(500)).toBe("500");
    expect(formatCount(1200)).toBe("1.2K");
    expect(formatCount(12400)).toBe("12.4K");
    expect(formatCount(1100000)).toBe("1.1M");
    expect(formatCount("∞")).toBe("∞");
  });

  it("computes SHA-256 hash properly", async () => {
    const hash = await sha256("172312");
    expect(hash).toBe("443d69a9f49646bb392f73b3e4e055bd32ef2b77c6bbd75119e561cac7db7809");
  });
});

