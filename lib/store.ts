import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { siteConfig } from "@/content/site";

export type UserComment = {
  id: string;
  user: string;
  text: string;
  creator?: boolean;
  time: string;
};

export type ActiveEffect = {
  id: string;
  clipId: string;
  effect: string;
  payload?: {
    text?: string;
    audio?: string;
    from?: string;
  };
};

export type FlyingHeart = {
  id: string;
  x: number;
  y: number;
  rotation: number;
};

interface ForUsState {
  unlocked: boolean;
  lastIndex: number;
  liked: string[];
  reposts: string[];
  saves: string[];
  followed: boolean;
  userComments: Record<string, UserComment[]>;
  finaleSeen: boolean;
  muted: boolean;
  wishesEnabled: boolean;
  wishCursor: Record<string, number>;
  activeEffect: ActiveEffect | null;
  flyingHearts: FlyingHeart[];
  isShareOpen: boolean;
  isCommentOpen: boolean;
  activeCommentClipId: string | null;
  activeShareClipId: string | null;
  isSongSheetOpen: boolean;
  activeSongClipId: string | null;
  isSecretOpen: boolean;
  isCreateOpen: boolean;
  isFinaleOpen: boolean;
  repostGlitchTarget: boolean;

  // Actions
  unlockGate: () => void;
  setLastIndex: (index: number) => void;
  toggleLike: (clipId: string, effectToTrigger?: string, payload?: { text?: string; audio?: string; from?: string }) => boolean;
  addDoubleTapLike: (clipId: string, x: number, y: number, effectToTrigger?: string, payload?: { text?: string; audio?: string; from?: string }) => void;
  removeFlyingHeart: (id: string) => void;
  repostClip: (clipId: string) => boolean;
  toggleSave: (clipId: string) => boolean;
  setFollowed: (val: boolean) => void;
  addComment: (clipId: string, text: string) => void;
  setFinaleSeen: (val: boolean) => void;
  toggleMute: () => void;
  toggleWishesEnabled: () => void;
  getAndIncrementWishCursor: (action: string, poolLength: number) => number;
  setActiveEffect: (effect: ActiveEffect | null) => void;
  openComments: (clipId: string) => void;
  closeComments: () => void;
  openShare: (clipId: string) => void;
  closeShare: () => void;
  openSongSheet: (clipId: string) => void;
  closeSongSheet: () => void;
  openSecret: () => void;
  closeSecret: () => void;
  openCreate: () => void;
  closeCreate: () => void;
  openFinale: () => void;
  closeFinale: () => void;
  triggerRepostGlitch: () => void;
}

export const useStore = create<ForUsState>()(
  persist(
    (set, get) => ({
      unlocked: false,
      lastIndex: 0,
      liked: [],
      reposts: [],
      saves: [],
      followed: false,
      userComments: {},
      finaleSeen: false,
      muted: true,
      wishesEnabled: true,
      wishCursor: {},
      activeEffect: null,
      flyingHearts: [],
      isShareOpen: false,
      isCommentOpen: false,
      activeCommentClipId: null,
      activeShareClipId: null,
      isSongSheetOpen: false,
      activeSongClipId: null,
      isSecretOpen: false,
      isCreateOpen: false,
      isFinaleOpen: false,
      repostGlitchTarget: false,

      unlockGate: () => set({ unlocked: true }),
      setLastIndex: (index) => set({ lastIndex: index }),

      toggleLike: (clipId, effectToTrigger, payload) => {
        const liked = get().liked;
        const isLiked = liked.includes(clipId);
        if (isLiked) {
          set({ liked: liked.filter((id) => id !== clipId) });
          return false;
        } else {
          set({ liked: [...liked, clipId] });
          if (effectToTrigger) {
            set({
              activeEffect: {
                id: `${clipId}-${Date.now()}`,
                clipId,
                effect: effectToTrigger,
                payload,
              },
            });
          }
          return true;
        }
      },

      addDoubleTapLike: (clipId, x, y, effectToTrigger, payload) => {
        const liked = get().liked;
        const isLiked = liked.includes(clipId);
        const newHearts = [
          ...get().flyingHearts,
          {
            id: `heart-${Date.now()}-${Math.random()}`,
            x,
            y,
            rotation: (Math.random() - 0.5) * 30, // ±15 deg
          },
        ];

        if (!isLiked) {
          set({
            liked: [...liked, clipId],
            flyingHearts: newHearts,
          });
          if (effectToTrigger) {
            set({
              activeEffect: {
                id: `${clipId}-${Date.now()}`,
                clipId,
                effect: effectToTrigger,
                payload,
              },
            });
          }
        } else {
          set({ flyingHearts: newHearts });
        }

        if (typeof navigator !== "undefined" && navigator.vibrate) {
          try {
            navigator.vibrate(10);
          } catch {
            // Ignore if vibration is restricted
          }
        }
      },

      removeFlyingHeart: (id) => {
        set({
          flyingHearts: get().flyingHearts.filter((h) => h.id !== id),
        });
      },

      repostClip: (clipId) => {
        const reposts = get().reposts;
        if (!reposts.includes(clipId)) {
          const nextReposts = [...reposts, clipId];
          set({ reposts: nextReposts });
          return true;
        }
        return false;
      },

      toggleSave: (clipId) => {
        const saves = get().saves;
        const isSaved = saves.includes(clipId);
        if (isSaved) {
          set({ saves: saves.filter((id) => id !== clipId) });
          return false;
        } else {
          set({ saves: [...saves, clipId] });
          return true;
        }
      },

      setFollowed: (val) => set({ followed: val }),

      addComment: (clipId, text) => {
        const current = get().userComments[clipId] || [];
        const newComment: UserComment = {
          id: `comment-${Date.now()}`,
          user: siteConfig.couple.herUsername,
          text,
          creator: false,
          time: "Baru saja",
        };
        set({
          userComments: {
            ...get().userComments,
            [clipId]: [newComment, ...current],
          },
        });
      },

      setFinaleSeen: (val) => set({ finaleSeen: val }),
      toggleMute: () => set({ muted: !get().muted }),
      toggleWishesEnabled: () => set({ wishesEnabled: !get().wishesEnabled }),

      getAndIncrementWishCursor: (action, poolLength) => {
        const currentCursor = get().wishCursor[action] ?? 0;
        const nextCursor = (currentCursor + 1) % poolLength;
        set({
          wishCursor: {
            ...get().wishCursor,
            [action]: nextCursor,
          },
        });
        return currentCursor;
      },

      setActiveEffect: (effect) => set({ activeEffect: effect }),
      openComments: (clipId) => set({ isCommentOpen: true, activeCommentClipId: clipId }),
      closeComments: () => set({ isCommentOpen: false, activeCommentClipId: null }),
      openShare: (clipId) => set({ isShareOpen: true, activeShareClipId: clipId }),
      closeShare: () => set({ isShareOpen: false, activeShareClipId: null }),
      openSongSheet: (clipId) => set({ isSongSheetOpen: true, activeSongClipId: clipId }),
      closeSongSheet: () => set({ isSongSheetOpen: false, activeSongClipId: null }),
      openSecret: () => set({ isSecretOpen: true }),
      closeSecret: () => set({ isSecretOpen: false }),
      openCreate: () => set({ isCreateOpen: true }),
      closeCreate: () => set({ isCreateOpen: false }),
      openFinale: () => set({ isFinaleOpen: true }),
      closeFinale: () => set({ isFinaleOpen: false }),

      triggerRepostGlitch: () => {
        set({ repostGlitchTarget: true });
        setTimeout(() => set({ repostGlitchTarget: false }), 600);
      },
    }),
    {
      name: "forus:v1",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        unlocked: state.unlocked,
        lastIndex: state.lastIndex,
        liked: state.liked,
        reposts: state.reposts,
        saves: state.saves,
        followed: state.followed,
        userComments: state.userComments,
        finaleSeen: state.finaleSeen,
        muted: state.muted,
        wishesEnabled: state.wishesEnabled,
        wishCursor: state.wishCursor,
      }),
    }
  )
);

