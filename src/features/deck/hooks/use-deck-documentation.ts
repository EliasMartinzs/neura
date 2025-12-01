import { create } from "zustand";

type UseDocumentation = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDeckDocumentation = create<UseDocumentation>((set) => ({
  open: false,
  onOpen: () => set({ open: true }),
  onClose: () => set({ open: false }),
}));
