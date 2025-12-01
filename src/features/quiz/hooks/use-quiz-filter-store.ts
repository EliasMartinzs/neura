import { $Enums } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterType = "ALL" | $Enums.QuizStatus;

type UseFiltersType = {
  filter: FilterType;
  page: number;
  perPage: number;
  setFilter: (filter: FilterType) => void;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  reset: () => void;
};

export const useQuizFilterStore = create<UseFiltersType>()(
  persist(
    (set) => ({
      filter: "ALL",
      page: 1,
      perPage: 10,
      setFilter: (filter) => set({ filter: filter, page: 1 }),
      setPage: (page) => set({ page }),
      setPerPage: (perPage) => set({ perPage, page: 1 }),
      reset: () => set({ page: 1, filter: "ALL", perPage: 10 }),
    }),
    {
      name: "quiz-filters-storage",
      partialize: (state) => ({
        perPage: state.perPage,
      }),
    }
  )
);
