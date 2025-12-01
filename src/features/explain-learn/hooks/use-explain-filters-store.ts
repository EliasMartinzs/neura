import { OpenStudyStatus } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ExplainQuestionsFiltersStore = {
  filter: "ALL" | OpenStudyStatus;
  page: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setFilter: (filter: OpenStudyStatus) => void;
};

export const useExplainQuestionsFiltersStore =
  create<ExplainQuestionsFiltersStore>()(
    persist(
      (set) => ({
        filter: "ALL",
        page: 1,
        perPage: 10,
        setPage: (page) => set({ page }),
        setPerPage: (perPage) => set({ perPage, page: 1 }),
        setFilter: (filter) => set({ filter }),
      }),
      {
        name: "explain-questions-storage",
        partialize: (state) => ({
          filter: state.filter,
        }),
      }
    )
  );
