import { describe, it, expect } from "vitest";
import { defaultSlots } from "../content/slots";
import { getFeedItems } from "../content/feed";
import { siteConfig } from "../content/site";

describe("Content Slots & Fidelity Rules", () => {
  it("contains all 12 expected slots", () => {
    expect(defaultSlots.length).toBe(12);
    const ids = defaultSlots.map((s) => s.id);
    expect(ids).toContain("slot-01");
    expect(ids).toContain("slot-02");
    expect(ids).toContain("slot-03");
    expect(ids).toContain("slot-04");
    expect(ids).toContain("slot-05");
    expect(ids).toContain("slot-06");
    expect(ids).toContain("slot-07");
    expect(ids).toContain("slot-08");
    expect(ids).toContain("slot-09");
    expect(ids).toContain("slot-10");
    expect(ids).toContain("bonus");
    expect(ids).toContain("finale");
  });

  it("ensures every slot has required TikTok metadata", () => {
    for (const slot of defaultSlots) {
      expect(slot.caption, `Missing caption for slot ${slot.id}`).toBeTruthy();
      expect(slot.song, `Missing song for slot ${slot.id}`).toBeDefined();
      expect(slot.song.title, `Missing song title for slot ${slot.id}`).toBeTruthy();
      expect(slot.song.artist, `Missing song artist for slot ${slot.id}`).toBeTruthy();
      expect(slot.baseCounts, `Missing baseCounts for slot ${slot.id}`).toBeDefined();
      expect(slot.baseCounts.likes).toBeGreaterThanOrEqual(1);
    }
  });

  it("dev feed returns placeholders when media is empty", () => {
    const devItems = getFeedItems(true);
    expect(devItems.length).toBeGreaterThan(0);
    expect(devItems.some((it) => it.isEmptyPlaceholder)).toBe(true);
  });

  it("production feed skips empty slots", () => {
    const prodItems = getFeedItems(false);
    // Since content/media folders are currently empty in initial state, prodItems should be empty
    expect(prodItems.every((it) => !it.isEmptyPlaceholder)).toBe(true);
  });

  it("validates site configuration", () => {
    expect(siteConfig.couple.her).toBeTruthy();
    expect(siteConfig.couple.me).toBeTruthy();
    expect(siteConfig.birthday.turning).toBeGreaterThan(0);
    expect(siteConfig.gateHash).toHaveLength(64); // SHA-256 is 64 hex characters
    expect(siteConfig.unlock.bonusAfterReposts).toBe(3);
  });
});
