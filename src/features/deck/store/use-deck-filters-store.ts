import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DeckFiltersStore {
  tags: string[];
  page: number;
  perPage: number;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  reset: () => void;
}

export const useDeckFiltersStore = create<DeckFiltersStore>()(
  persist(
    (set) => ({
      tags: [],
      page: 1,
      perPage: 10,
      toggleTag: (tag) =>
        set((state) => ({
          tags: state.tags.includes(tag)
            ? state.tags.filter((t) => t !== tag)
            : [...state.tags, tag],
        })),
      clearTags: () => set({ tags: [], page: 1 }),
      setPage: (page) => set({ page }),
      setPerPage: (perPage) => set({ perPage, page: 1 }),
      reset: () => set({ tags: [], page: 1, perPage: 10 }),
    }),
    {
      name: "deck-filters-storage",
      partialize: (state) => ({
        perPage: state.perPage,
        tags: state.tags,
      }),
    }
  )
);
