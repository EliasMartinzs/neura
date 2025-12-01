import { create } from "zustand";

type UseDocumentation = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useFlashcardDocumentation = create<UseDocumentation>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
