import { create } from "zustand";
import { persist } from "zustand/middleware";

type UseDeckFilters = {
  tags: string[];
  page: number;
  perPage: number;
  search: string;
  setSearch: (search: string) => void;
  toggleTag: (tag: string) => void;
  clearTags: () => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  reset: () => void;
};

export const useDeckFilterStore = create<UseDeckFilters>()(
  persist(
    (set) => ({
      tags: [],
      page: 1,
      perPage: 10,
      search: "",
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
      setSearch: (search: string) => set({ search }),
    }),
    {
      name: "deck-toolbar-storage",
      partialize: (state) => ({
        perPage: state.perPage,
      }),
    }
  )
);
