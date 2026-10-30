import { describe, it, expect } from "vitest";
import { getFeedItems, type FeedItem } from "../content/feed";
import { type ContentSlot } from "../content/slots";
import slotsJsonData from "../content/slots.json";

describe("Slots JSON & CRUD Feed Integration", () => {
  it("loads valid slots from content/slots.json", () => {
    expect(Array.isArray(slotsJsonData)).toBe(true);
    expect(slotsJsonData.length).toBeGreaterThanOrEqual(12);

    const first = slotsJsonData[0] as ContentSlot;
    expect(first.id).toBe("slot-01");
    expect(first.type).toBe("video");
    expect(first.title).toBeTruthy();
  });

  it("getFeedItems correctly uses direct uploaded video media", () => {
    const customSlot: ContentSlot = {
      id: "slot-custom-video",
      type: "video",
      title: "Video Ujian",
      caption: "Caption video test",
      src: "/uploads/videos/test-video.mp4",
      poster: "/uploads/posters/test-poster.jpg",
      song: {
        title: "Test Song",
        artist: "Test Artist",
        cover: "/covers/test.jpg",
      },
      baseCounts: { likes: 1, comments: 0, saves: 0, shares: 0, reposts: 0 },
      comments: [],
    };

    const items = getFeedItems(false, [customSlot]);
    expect(items.length).toBe(1);
    expect(items[0].type).toBe("video");
    expect(items[0].src).toBe("/uploads/videos/test-video.mp4");
    expect(items[0].poster).toBe("/uploads/posters/test-poster.jpg");
    expect(items[0].isEmptyPlaceholder).toBeFalsy();
  });

  it("getFeedItems correctly uses direct uploaded photo carousel media", () => {
    const customSlot: ContentSlot = {
      id: "slot-custom-photo",
      type: "photo-carousel",
      title: "Foto Ujian",
      caption: "Kumpulan foto kenangan",
      photos: [
        { src: "/uploads/photos/photo-1.jpg", caption: "Hari pertama" },
        { src: "/uploads/photos/photo-2.jpg", caption: "Hari kedua" },
      ],
      photoStyle: "polaroid",
      song: {
        title: "Test Song",
        artist: "Test Artist",
        cover: "/covers/test.jpg",
      },
      baseCounts: { likes: 1, comments: 0, saves: 0, shares: 0, reposts: 0 },
      comments: [],
    };

    const items = getFeedItems(false, [customSlot]);
    expect(items.length).toBe(1);
    expect(items[0].type).toBe("photo");
    expect(items[0].photos).toHaveLength(2);
    expect(items[0].photos?.[0].src).toBe("/uploads/photos/photo-1.jpg");
    expect(items[0].photoStyle).toBe("polaroid");
    expect(items[0].isEmptyPlaceholder).toBeFalsy();
  });

  it("handles sound behavior: video without custom audio uses native video sound, video with custom audio preserves song.audio", () => {
    const videoSlotWithoutAudio: ContentSlot = {
      id: "slot-native-sound",
      type: "video",
      title: "Video Suara Asli",
      caption: "Video tanpa lagu kustom",
      src: "/uploads/videos/native.mp4",
      song: {
        title: "Suara asli - Rado & Una",
        artist: "Rado & Una",
        cover: "/covers/song-1.jpg",
      },
      baseCounts: { likes: 1, comments: 0, saves: 0, shares: 0, reposts: 0 },
      comments: [],
    };

    const videoSlotWithCustomAudio: ContentSlot = {
      id: "slot-custom-sound",
      type: "video",
      title: "Video Lagu Kustom",
      caption: "Video dengan lagu kustom",
      src: "/uploads/videos/custom.mp4",
      song: {
        title: "Lagu Romantis",
        artist: "Artis",
        cover: "/covers/song-2.jpg",
        audio: "/uploads/audio/romantic-song.mp3",
      },
      baseCounts: { likes: 1, comments: 0, saves: 0, shares: 0, reposts: 0 },
      comments: [],
    };

    const items = getFeedItems(false, [videoSlotWithoutAudio, videoSlotWithCustomAudio]);
    expect(items[0].song.audio).toBeUndefined(); // native video sound
    expect(items[1].song.audio).toBe("/uploads/audio/romantic-song.mp3"); // custom soundtrack
  });
});
