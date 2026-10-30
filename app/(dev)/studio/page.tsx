"use client";

import React, { useState, useEffect } from "react";
import { defaultSlots, type ContentSlot } from "@/content/slots";
import { type LikeEffect } from "@/content/site";
import {
  VideoUploader,
  PhotoCarouselUploader,
  AudioUploader,
} from "@/components/uploader";
import { PhotoTile } from "@/components/feed/PhotoTile";
import { type FeedItem } from "@/content/feed";

export default function StudioPage() {
  const [slots, setSlots] = useState<ContentSlot[]>(defaultSlots);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("slot-01");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [previewMuted, setPreviewMuted] = useState<boolean>(true);

  // New slot dialog state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newSlotTitle, setNewSlotTitle] = useState<string>("");
  const [newSlotType, setNewSlotType] = useState<ContentSlot["type"]>("video");

  // Fetch slots from API (JSON)
  useEffect(() => {
    async function loadSlots() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/slots", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.slots) && data.slots.length > 0) {
          setSlots(data.slots);

          // Restore last selected slot from localStorage or URL parameter
          let targetSlotId = data.slots[0].id;
          if (typeof window !== "undefined") {
            const urlParam = new URLSearchParams(window.location.search).get("slot");
            const stored = window.localStorage.getItem("forus_studio_selected_slot");
            const candidate = urlParam || stored;
            if (candidate && data.slots.some((s: ContentSlot) => s.id === candidate)) {
              targetSlotId = candidate;
            }
          }
          setSelectedSlotId(targetSlotId);
        }
      } catch (err) {
        console.error("Gagal memuat slots:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSlots();
  }, []);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || slots[0] || defaultSlots[0];
  const selectedIndex = slots.findIndex((s) => s.id === selectedSlotId);

  // Switch selected slot with persistence
  const handleSelectSlot = (id: string) => {
    setSelectedSlotId(id);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("forus_studio_selected_slot", id);
        const url = new URL(window.location.href);
        url.searchParams.set("slot", id);
        window.history.replaceState({}, "", url.toString());
      } catch {}
    }
  };

  // Partial update on selected slot
  const updateSelectedSlot = (fields: Partial<ContentSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === selectedSlotId ? { ...s, ...fields } : s))
    );
  };

  // Auto-save a slot directly to server JSON
  const autoSaveSlot = async (slot: ContentSlot) => {
    try {
      const res = await fetch("/api/slots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus(`💾 Media ${slot.id} berhasil diunggah & tersimpan otomatis! ✨`);
        setTimeout(() => setSaveStatus(null), 3500);
      }
    } catch (err) {
      console.error("Auto save failed:", err);
    }
  };

  // Save current slots to server JSON
  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch("/api/slots", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveStatus("Semua perubahan tersimpan ke content/slots.json! ✨");
        setTimeout(() => setSaveStatus(null), 3500);
      } else {
        throw new Error(data.error || "Gagal menyimpan");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      setSaveStatus(`❌ Error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Reorder slots
  const handleMoveSlot = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slots.length) return;

    const updated = [...slots];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setSlots(updated);
  };

  // Delete slot
  const handleDeleteSlot = async (slotId: string) => {
    if (slots.length <= 1) {
      alert("Harus ada minimal 1 slot di feed!");
      return;
    }
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus slot "${slotId}"? Aksi ini akan menghapusnya dari daftar.`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/slots?id=${slotId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setSlots(data.slots);
        setSelectedSlotId(data.slots[0]?.id || "slot-01");
        setSaveStatus(`Slot ${slotId} berhasil dihapus.`);
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error("Gagal menghapus:", err);
    }
  };

  // Create new slot
  const handleCreateSlot = async () => {
    if (!newSlotTitle.trim()) {
      alert("Masukkan judul kenangan untuk slot baru");
      return;
    }

    const nextNumber = slots.length + 1;
    const newId = `slot-${String(nextNumber).padStart(2, "0")}`;

    const newSlot: ContentSlot = {
      id: newId,
      type: newSlotType,
      title: newSlotTitle,
      caption: `${newSlotTitle} ❤️✨ #kitaberdua #forus`,
      hashtags: ["kitaberdua", "forus"],
      photoStyle: "plain",
      photoMode: newSlotType === "photo-slideshow" ? "slideshow" : "swipe",
      secondsPerPhoto: 3,
      song: {
        title: newSlotType === "video" ? `Suara asli - ${newSlotTitle}` : "Lagu Kenangan Baru",
        artist: "Kita Berdua",
        cover: "/covers/song-1.jpg",
      },
      baseCounts: {
        likes: 1,
        comments: 0,
        saves: 0,
        shares: 0,
        reposts: 0,
      },
      onLike: {
        effect: "confetti",
      },
      comments: [],
      autoReply: {
        text: "Terima kasih sudah selalu ada di sisiku sayang! ❤️",
        delayMs: 1200,
      },
    };

    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.slots)) {
        setSlots(data.slots);
        setSelectedSlotId(newSlot.id);
        setShowAddModal(false);
        setNewSlotTitle("");
        setSaveStatus(`Slot baru ${newSlot.id} berhasil ditambahkan! 🎉`);
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err) {
      console.error("Gagal menambahkan:", err);
    }
  };

  // Prepare feed item for live 9:16 preview
  const previewFeedItem: FeedItem = {
    id: selectedSlot.id,
    slot: selectedSlot.id,
    type: selectedSlot.type === "video" ? "video" : "photo",
    src: selectedSlot.src,
    poster: selectedSlot.poster || "",
    photos: selectedSlot.photos || [],
    photoMode: selectedSlot.photoMode || "swipe",
    photoStyle: selectedSlot.photoStyle || "plain",
    secondsPerPhoto: selectedSlot.secondsPerPhoto || 3,
    caption: selectedSlot.caption,
    hashtags: selectedSlot.hashtags || [],
    song: selectedSlot.song,
    baseCounts: selectedSlot.baseCounts,
    onLike: selectedSlot.onLike,
    comments: selectedSlot.comments,
    autoReply: selectedSlot.autoReply,
  };

  // Text display for preview music ticker
  const previewSongText =
    selectedSlot.type === "video" && !selectedSlot.song.audio
      ? `Suara asli - @${selectedSlot.song.artist || "rado.aja"}`
      : `${selectedSlot.song.title} — ${selectedSlot.song.artist}`;

  return (
    <div className="min-h-screen bg-[#12141d] text-white p-4 sm:p-6 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#3a3a3a] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[22px]">🎬</span>
              <h1 className="text-[22px] font-bold text-white tracking-tight">
                ForUs Content Studio & CRUD
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary text-white">
                JSON STORAGE
              </span>
            </div>
            <p className="text-[13px] text-[#a8a8a8] mt-1">
              Kelola video, foto carousel, sound/lagu (otomatis suara video jika tanpa musik), caption, dan efek like ke JSON.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-lg bg-[#242838] border border-[#3a3a3a] text-white text-[13px] font-semibold hover:border-primary transition-colors flex items-center gap-1.5"
            >
              <span>＋</span> Tambah Slot Baru
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-lg shadow-primary/20"
            >
              {isSaving ? "Menyimpan..." : "💾 Simpan ke JSON"}
            </button>

            <a
              href="/feed"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-[#1f1f1f] border border-[#3a3a3a] text-white text-[13px] font-semibold hover:border-white transition-colors flex items-center gap-1"
            >
              Lihat di Feed 📱
            </a>
          </div>
        </div>

        {/* Status notification toast */}
        {saveStatus && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary text-white text-[13px] font-semibold flex items-center justify-between animate-in fade-in duration-200">
            <span>{saveStatus}</span>
            <button
              type="button"
              onClick={() => setSaveStatus(null)}
              className="text-[#a8a8a8] hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[#a8a8a8] text-[14px]">Memuat data slot dari content/slots.json...</p>
          </div>
        ) : (
          /* Main Studio Grid: Slot List + Editor + Live 9:16 Preview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT: Slot Reorder & Select (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[13px] font-bold text-white uppercase tracking-wider">
                  Daftar Slot ({slots.length})
                </span>
                <span className="text-[11px] text-[#a8a8a8]">Urutan Feed</span>
              </div>

              <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
                {slots.map((s, idx) => {
                  const isSelected = s.id === selectedSlotId;
                  const hasMedia =
                    (s.type === "video" && !!s.src) ||
                    ((s.type === "photo-carousel" || s.type === "photo-slideshow") &&
                      !!s.photos &&
                      s.photos.length > 0);

                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSlot(s.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/15"
                          : "border-[#2a2a2a] bg-[#1a1d29] hover:border-[#444444]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <span className="text-[18px]">
                          {s.type === "video" ? "🎬" : s.type === "photo-slideshow" ? "🎞️" : "📸"}
                        </span>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded bg-black/50 text-[#a8a8a8]">
                              #{idx + 1}
                            </span>
                            <span className="text-[13px] font-semibold text-white truncate">
                              {s.title || s.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-[#a8a8a8] mt-0.5">
                            <span>{s.type}</span>
                            <span>•</span>
                            <span className={hasMedia ? "text-green-400" : "text-amber-400"}>
                              {hasMedia ? "Media OK" : "Kosong"}
                            </span>
                            {s.song.audio && (
                              <span className="text-primary font-bold">♪ Audio</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reorder Up/Down */}
                      <div
                        className="flex flex-col gap-1 shrink-0 ml-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveSlot(idx, "up")}
                          className="w-5 h-5 flex items-center justify-center rounded bg-[#242838] text-[10px] text-[#a8a8a8] hover:text-white disabled:opacity-20"
                          title="Geser ke atas"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === slots.length - 1}
                          onClick={() => handleMoveSlot(idx, "down")}
                          className="w-5 h-5 flex items-center justify-center rounded bg-[#242838] text-[10px] text-[#a8a8a8] hover:text-white disabled:opacity-20"
                          title="Geser ke bawah"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CENTER: Slot Editor & Uploader (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl bg-[#1a1d29] border border-[#2a2a2a] space-y-5">
                {/* Editor Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#2a2a2a]">
                  <div>
                    <span className="text-[11px] font-bold text-primary uppercase tracking-wider font-mono">
                      {selectedSlot.id} (Slot #{selectedIndex + 1})
                    </span>
                    <h2 className="text-[17px] font-bold text-white mt-0.5">
                      {selectedSlot.title || "Detail Konten"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(selectedSlot.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-[11px] font-semibold hover:bg-red-900/60 transition-colors"
                  >
                    Hapus Slot
                  </button>
                </div>

                {/* Basic Fields: Title & Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Judul Kenangan
                    </label>
                    <input
                      type="text"
                      value={selectedSlot.title || ""}
                      onChange={(e) => updateSelectedSlot({ title: e.target.value })}
                      placeholder="Contoh: Kencan Pertama Kita"
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[13px] focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Tipe Konten
                    </label>
                    <select
                      value={selectedSlot.type}
                      onChange={(e) =>
                        updateSelectedSlot({
                          type: e.target.value as ContentSlot["type"],
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[13px] focus:outline-none focus:border-primary"
                    >
                      <option value="video">🎬 Video (.mp4 / 9:16)</option>
                      <option value="photo-carousel">📸 Foto Carousel (Swipe)</option>
                      <option value="photo-slideshow">🎞️ Foto Slideshow (Auto-advance)</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Uploader Section */}
                <div className="pt-2 border-t border-[#2a2a2a]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-white uppercase tracking-wider">
                      Uploader Media {selectedSlot.type === "video" ? "Video" : "Foto"}
                    </span>
                    <span className="text-[11px] text-[#a8a8a8]">
                      Disimpan di public/uploads
                    </span>
                  </div>

                  {selectedSlot.type === "video" ? (
                    <div className="space-y-3">
                      {/* Helpful switcher if user wanted photo mode */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#242838]/60 border border-[#3a3a3a] text-[12px] text-[#a8a8a8]">
                        <span>Ingin slot #{selectedIndex + 1} berupa Foto Carousel?</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated: ContentSlot = {
                              ...selectedSlot,
                              type: "photo-carousel",
                            };
                            updateSelectedSlot({ type: "photo-carousel" });
                            autoSaveSlot(updated);
                          }}
                          className="px-2.5 py-1 rounded bg-[#1f1f1f] border border-primary/50 text-white font-semibold hover:bg-primary/20 transition-colors"
                        >
                          Ubah ke Foto Carousel 📸
                        </button>
                      </div>

                      {selectedSlot.photos && selectedSlot.photos.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/50 text-amber-200 text-[12px] flex items-center justify-between">
                          <span>⚠️ Ada {selectedSlot.photos.length} foto tersimpan pada slot ini.</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated: ContentSlot = {
                                ...selectedSlot,
                                type: "photo-carousel",
                              };
                              updateSelectedSlot({ type: "photo-carousel" });
                              autoSaveSlot(updated);
                            }}
                            className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-[11px]"
                          >
                            Tampilkan Foto
                          </button>
                        </div>
                      )}

                      <VideoUploader
                        videoSrc={selectedSlot.src}
                        posterSrc={selectedSlot.poster}
                        onChange={(videoSrc, posterSrc) => {
                          const updated: ContentSlot = {
                            ...selectedSlot,
                            src: videoSrc,
                            poster: posterSrc,
                          };
                          updateSelectedSlot({ src: videoSrc, poster: posterSrc });
                          autoSaveSlot(updated);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Photo style picker */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                            Gaya Tampilan Foto (photoStyle)
                          </label>
                          <select
                            value={selectedSlot.photoStyle || "plain"}
                            onChange={(e) =>
                              updateSelectedSlot({
                                photoStyle: e.target.value as ContentSlot["photoStyle"],
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                          >
                            <option value="plain">plain (geser layar penuh 9:16)</option>
                            <option value="kenburns">kenburns (slow zoom 6s)</option>
                            <option value="polaroid">polaroid (bingkai putih bertumpuk)</option>
                            <option value="stack">stack (kartu bertumpuk)</option>
                          </select>
                        </div>

                        {(selectedSlot.type === "photo-carousel" ||
                          selectedSlot.type === "photo-slideshow") && (
                          <div>
                            <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                              Durasi Otomatis per Foto (detik)
                            </label>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              step={0.5}
                              value={selectedSlot.secondsPerPhoto || 3.5}
                              onChange={(e) =>
                                updateSelectedSlot({
                                  secondsPerPhoto: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                            />
                          </div>
                        )}
                      </div>

                      <PhotoCarouselUploader
                        photos={selectedSlot.photos || []}
                        onChange={(photos) => {
                          const updated: ContentSlot = {
                            ...selectedSlot,
                            photos,
                            poster: photos[0]?.src || selectedSlot.poster || "",
                          };
                          updateSelectedSlot({
                            photos,
                            poster: photos[0]?.src || selectedSlot.poster || "",
                          });
                          autoSaveSlot(updated);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Sound / Music Settings (AudioUploader) */}
                <div className="pt-2 border-t border-[#2a2a2a]">
                  <AudioUploader
                    audioSrc={selectedSlot.song.audio}
                    songTitle={selectedSlot.song.title}
                    songArtist={selectedSlot.song.artist}
                    songCover={selectedSlot.song.cover}
                    isVideo={selectedSlot.type === "video"}
                    onAudioChange={(audioUrl) => {
                      const updated: ContentSlot = {
                        ...selectedSlot,
                        song: {
                          ...selectedSlot.song,
                          audio: audioUrl,
                        },
                      };
                      updateSelectedSlot({
                        song: {
                          ...selectedSlot.song,
                          audio: audioUrl,
                        },
                      });
                      autoSaveSlot(updated);
                    }}
                    onSongInfoChange={(fields) => {
                      updateSelectedSlot({
                        song: {
                          ...selectedSlot.song,
                          ...fields,
                        },
                      });
                    }}
                  />
                </div>

                {/* Caption & Hashtags */}
                <div className="space-y-3 pt-2 border-t border-[#2a2a2a]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Caption Feed
                    </label>
                    <textarea
                      rows={3}
                      value={selectedSlot.caption}
                      onChange={(e) => updateSelectedSlot({ caption: e.target.value })}
                      placeholder="Tulis caption romantis untuk pacarmu..."
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[13px] focus:outline-none focus:border-primary leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Hashtags (pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={(selectedSlot.hashtags || []).join(", ")}
                      onChange={(e) =>
                        updateSelectedSlot({
                          hashtags: e.target.value
                            .split(",")
                            .map((h) => h.trim().replace(/^#/, ""))
                            .filter(Boolean),
                        })
                      }
                      placeholder="kitaberdua, forus, birthdaygirl"
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Like Effect & Birthday Wish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#2a2a2a]">
                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Efek Like Spesial (onLike)
                    </label>
                    <select
                      value={selectedSlot.onLike?.effect || "confetti"}
                      onChange={(e) =>
                        updateSelectedSlot({
                          onLike: { effect: e.target.value as LikeEffect },
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                    >
                      <option value="confetti">confetti (magenta/cyan/putih)</option>
                      <option value="hearts-rain">hearts-rain (hujan hati)</option>
                      <option value="letter-pop">letter-pop (surat amplop)</option>
                      <option value="photo-reveal">photo-reveal (polaroid jatuh)</option>
                      <option value="glitch-heart">glitch-heart (hati glitch)</option>
                      <option value="sticker-burst">sticker-burst (ledakan stiker)</option>
                      <option value="voice-note">voice-note (pesan suara)</option>
                      <option value="milestone">milestone (counter hari bersama)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                      Ucapan Ulang Tahun Khusus (Wish Layer)
                    </label>
                    <input
                      type="text"
                      value={selectedSlot.wish || ""}
                      onChange={(e) => updateSelectedSlot({ wish: e.target.value })}
                      placeholder="Doa manis untuk klip ini (opsional)..."
                      className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Auto Reply on comment */}
                <div className="pt-2 border-t border-[#2a2a2a]">
                  <label className="text-[11px] font-semibold text-[#a8a8a8] block mb-1">
                    Balasan Otomatis Pembuat Saat Dia Komentar (autoReply)
                  </label>
                  <input
                    type="text"
                    value={selectedSlot.autoReply?.text || ""}
                    onChange={(e) =>
                      updateSelectedSlot({
                        autoReply: { text: e.target.value, delayMs: 1200 },
                      })
                    }
                    placeholder="Pesan yang otomatis terkirim dari kamu..."
                    className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[12px] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Live 9:16 TikTok Phone Preview (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center sticky top-6">
              <div className="flex items-center justify-between w-[320px] mb-2 px-1">
                <span className="text-[12px] font-bold text-white uppercase tracking-wider">
                  Live Preview 9:16
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewMuted((m) => !m)}
                  className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {previewMuted ? "🔇 Suara Mati" : "🔊 Suara Hidup"}
                </button>
              </div>

              {/* 320x568 phone frame with 9:16 ratio */}
              <div className="w-[320px] h-[568px] rounded-3xl border-4 border-[#2a2a2a] bg-black overflow-hidden relative shadow-2xl flex flex-col justify-between select-none">
                {/* Media Layer */}
                <div className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden">
                  {selectedSlot.type === "video" ? (
                    selectedSlot.src ? (
                      <>
                        <video
                          src={selectedSlot.src}
                          poster={selectedSlot.poster}
                          autoPlay
                          loop
                          muted={selectedSlot.song.audio ? true : previewMuted}
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        {selectedSlot.song.audio && (
                          <audio
                            src={selectedSlot.song.audio}
                            autoPlay
                            loop
                            muted={previewMuted}
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <span className="text-[36px] mb-2">🎬</span>
                        <p className="text-[13px] font-semibold text-white">
                          Video belum diunggah
                        </p>
                        <p className="text-[11px] text-[#737373] mt-1">
                          Unggah video .mp4 di uploader sebelah kiri
                        </p>
                        {selectedSlot.photos && selectedSlot.photos.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated: ContentSlot = {
                                ...selectedSlot,
                                type: "photo-carousel",
                              };
                              updateSelectedSlot({ type: "photo-carousel" });
                              autoSaveSlot(updated);
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-primary text-white text-[11px] font-bold hover:opacity-90 transition-opacity"
                          >
                            Tampilkan {selectedSlot.photos.length} Foto Tersimpan 📸
                          </button>
                        )}
                      </div>
                    )
                  ) : selectedSlot.photos && selectedSlot.photos.length > 0 ? (
                    <>
                      <PhotoTile
                        key={`${selectedSlot.id}-${selectedSlot.photos?.length || 0}`}
                        item={previewFeedItem}
                        isActive={true}
                        showInternalProgressBar={true}
                      />
                      {selectedSlot.song.audio && (
                        <audio
                          src={selectedSlot.song.audio}
                          autoPlay
                          loop
                          muted={previewMuted}
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-[36px] mb-2">📸</span>
                      <p className="text-[13px] font-semibold text-white">
                        Carousel belum ada foto
                      </p>
                      <p className="text-[11px] text-[#737373] mt-1">
                        Unggah beberapa foto di uploader sebelah kiri
                      </p>
                    </div>
                  )}
                </div>

                {/* Top scrim and bar */}
                <div className="relative z-10 p-3 pt-4 flex items-center justify-between text-[11px] text-white/70 bg-gradient-to-b from-black/60 to-transparent">
                  <span>Mengikuti</span>
                  <span className="text-white font-bold underline decoration-primary decoration-2 underline-offset-4">
                    Untuk Kita
                  </span>
                  <span>🔍</span>
                </div>

                {/* Right Rail Simulation */}
                <div className="absolute right-2 bottom-20 z-10 flex flex-col items-center space-y-3 text-white text-[10px]">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full border border-white bg-primary flex items-center justify-center text-[12px] font-bold">
                    ❤️
                  </div>
                  {/* Like */}
                  <div className="flex flex-col items-center">
                    <span className="text-[20px] text-primary">❤️</span>
                    <span className="text-[10px] font-semibold">
                      {selectedSlot.baseCounts.likes}
                    </span>
                  </div>
                  {/* Comment */}
                  <div className="flex flex-col items-center">
                    <span className="text-[18px]">💬</span>
                    <span className="text-[10px] font-semibold">
                      {selectedSlot.baseCounts.comments}
                    </span>
                  </div>
                  {/* Repost */}
                  <div className="flex flex-col items-center">
                    <span className="text-[18px]">🔄</span>
                    <span className="text-[10px] font-semibold">
                      {selectedSlot.baseCounts.reposts}
                    </span>
                  </div>
                  {/* Music Disc */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1f1f1f] to-[#3a3a3a] border border-white/20 flex items-center justify-center text-[10px] animate-spin">
                    🎵
                  </div>
                </div>

                {/* Bottom Scrim & Caption */}
                <div className="relative z-10 p-3 pb-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-left space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-white">
                      @{selectedSlot.song.artist.toLowerCase().replace(/\s+/g, "")}
                    </span>
                    <span className="text-[10px] px-1 rounded bg-primary text-white font-bold">
                      {selectedSlot.onLike?.effect}
                    </span>
                  </div>

                  <p className="text-[12px] text-white/95 line-clamp-2 leading-snug">
                    {selectedSlot.caption}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-white/80 pt-1">
                    <span>🎵</span>
                    <span className="truncate max-w-[200px]">
                      {previewSongText}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Add New Slot */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#1a1d29] border border-[#3a3a3a] space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
              <h3 className="text-[16px] font-bold text-white flex items-center gap-2">
                <span>✨</span> Buat Slot Konten Baru
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#a8a8a8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-[#a8a8a8] block mb-1">
                  Judul Kenangan
                </label>
                <input
                  type="text"
                  value={newSlotTitle}
                  onChange={(e) => setNewSlotTitle(e.target.value)}
                  placeholder="Misal: Liburan ke Pantai Berdua"
                  className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[13px] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[12px] font-semibold text-[#a8a8a8] block mb-1">
                  Tipe Konten
                </label>
                <select
                  value={newSlotType}
                  onChange={(e) =>
                    setNewSlotType(e.target.value as ContentSlot["type"])
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#12141d] border border-[#3a3a3a] text-white text-[13px] focus:outline-none focus:border-primary"
                >
                  <option value="video">🎬 Video (.mp4 / 9:16)</option>
                  <option value="photo-carousel">📸 Foto Carousel (Swipe horizontal)</option>
                  <option value="photo-slideshow">🎞️ Foto Slideshow (Auto-advance)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-[#242838] text-white text-[13px] font-semibold hover:bg-[#333333]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreateSlot}
                className="px-4 py-2 rounded-lg bg-primary text-white text-[13px] font-semibold hover:opacity-90 shadow-md shadow-primary/20"
              >
                Tambah Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
