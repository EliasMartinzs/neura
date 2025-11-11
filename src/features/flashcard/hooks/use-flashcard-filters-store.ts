import { create } from "zustand";
import { persist } from "zustand/middleware";

type FlashcardFiltersStore = {
  deck: string;
  page: number;
  perPage: number;
  onSet: (deck: string) => void;
  clearDeck: () => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  reset: () => void;
};

export const useFlashcardFiltersStore = create<FlashcardFiltersStore>()(
  persist(
    (set) => ({
      deck: "",
      page: 1,
      perPage: 10,
      onSet: (deck) =>
        set(() => ({
          deck: deck,
        })),
      clearDeck: () =>
        set({
          deck: "",
        }),
      setPage: (page) =>
        set({
          page,
        }),
      setPerPage: (perPage) => set({ perPage, page: 1 }),
      reset: () => set({ page: 1, deck: "", perPage: 10 }),
    }),
    {
      name: "flashcard-filters-storage",
      partialize: (state) => ({
        deck: state.deck,
      }),
    }
  )
);
