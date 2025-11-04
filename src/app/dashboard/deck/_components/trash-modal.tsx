"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useGetTrash } from "@/features/deck/api/use-get-trash";
import { useTrashStore } from "@/features/deck/store/use-trash-store";
import { cn } from "@/lib/utils";
import { Calendar, Loader2, LoaderCircle, Trash, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PermanentDeleteButton } from "./permanent-delete-button";
import { getForeground } from "@/constants/circle-colors";
import { DeleteAccountButton } from "../../profile/_components/delete-account-button";
import { DeleteAllDecksFromTrash } from "./delete-all-decks-from-trash";

export const TrashModal = () => {
  const { open, onClose } = useTrashStore();
  const { data, isLoading, isError, refetch, isFetching } = useGetTrash();

  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Carregando...
          </span>
        </div>
      );

    if (isError)
      return (
        <div className="flex flex-col items-center justify-center gap-y-4">
          <p className="text-center text-destructive text-base">
            Ocorreu um erro ao carregar os decks da lixeira.
          </p>
          <Button
            variant={"destructive"}
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Recarregar <LoaderCircle className="size-5" />
              </>
            )}
          </Button>
        </div>
      );

    if (!data?.data?.length)
      return (
        <p className="text-center text-muted-foreground py-6">
          Nenhum deck na lixeira.
        </p>
      );

    return (
      <div className="mt-4 flex flex-wrap gap-4">
        {data?.data?.map(({ color, deletedAt, name, id }) => (
          <div
            key={name}
            className={cn(
              "border rounded-3xl p-4 flex flex-col gap-y-4 min-w-64"
            )}
            style={{
              borderColor: color as string,
            }}
          >
            <div className="flex items-start justify-between">
              <h4 className="capitalize text-lg">{name}</h4>
              <div className="ml-4">
                <PermanentDeleteButton
                  textColor={getForeground(color || "")}
                  id={id}
                />
              </div>
            </div>

            <div>
              {deletedAt && (
                <span className="flex items-center gap-x-3">
                  <Calendar className="size-5" strokeWidth={0.8} />
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(deletedAt))}
                </span>
              )}
            </div>
          </div>
        ))}

        <div className="w-full flex justify-end">
          <DeleteAllDecksFromTrash
            ids={data?.data?.map((item) => item.id) ?? []}
            onClose={onClose}
          />
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] md:max-w-md xl:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              Aqui estão os decks que você moveu para a lixeira.
            </DialogTitle>
            <DialogDescription>
              Eles permanecerão armazenados por até 30 dias, após esse período
              serão excluídos permanentemente. Você pode restaurar um deck ou
              removê-lo definitivamente a qualquer momento.
            </DialogDescription>
          </DialogHeader>
          {renderContent()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Aqui estão os decks que você moveu para a lixeira.
          </DrawerTitle>
          <DrawerDescription>
            Eles permanecerão armazenados por até 30 dias, após esse período
            serão excluídos permanentemente. Você pode restaurar um deck ou
            removê-lo definitivamente a qualquer momento.
          </DrawerDescription>
        </DrawerHeader>

        {renderContent()}
      </DrawerContent>
    </Drawer>
  );
};
