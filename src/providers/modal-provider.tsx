"use client";

import { TrashModal } from "@/app/dashboard/deck/_components/trash-modal";
import { useTrashStore } from "@/features/deck/store/use-trash-store";
import { Activity } from "react";

export const ModalProvider = () => {
  const { open } = useTrashStore();

  return (
    <>
      <Activity mode={open ? "visible" : "hidden"}>{<TrashModal />}</Activity>
    </>
  );
};
