import { create } from "zustand";

type UseTrashProps = {
  open: boolean;
  onOpen: (open: boolean) => void;
  onClose: (close: boolean) => void;
};

export const useTrashStore = create<UseTrashProps>((set) => ({
  open: false,
  onOpen: (open) => set({ open: true }),
  onClose: (close) => set({ open: close }),
}));
