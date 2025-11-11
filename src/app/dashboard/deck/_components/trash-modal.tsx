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
import { useRestoreDeck } from "@/features/deck/api/use-restore-deck";
import { useTrashStore } from "@/features/deck/store/use-trash-store";
import {
  ArchiveRestore,
  Calendar,
  DiffIcon,
  Loader2,
  LoaderCircle,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteAllDecksFromTrash } from "./delete-all-decks-from-trash";
import { getForeground } from "@/constants/circle-colors";
import { DIFFICULTY } from "@/constants/difficulty";
import { DeckDifficulty } from "@prisma/client";
import { PermanentDeleteButton } from "./permanent-delete-button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TrashModal = () => {
  const { open, onClose } = useTrashStore();
  const { data, isLoading, isError, refetch, isFetching } = useGetTrash();
  const { mutate } = useRestoreDeck();

  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  async function handleRestoreDeck(id: string) {
    mutate({
      id,
    });
  }

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
      <div className="mt-4 flex flex-col gap-6 p-4 overflow-y-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full shadow-sm mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Lixeira</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground/70 via-primary/70 to-foreground/25 bg-clip-text text-transparent">
            Decks na lixeira
          </h1>
          <p className="text-foreground mt-2">
            Eles permanecerão armazenados por até 30 dias, após esse período
            serão excluídos permanentemente. Você pode restaurar um deck ou
            removê-lo definitivamente a qualquer momento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.data?.map(({ color, deletedAt, name, id, difficulty }) => (
            <div
              key={id}
              className="rounded-xl shadow flex flex-col gap-4 p-6"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}cc, ${color}40`,
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
                  <DiffIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">
                    {DIFFICULTY[difficulty as DeckDifficulty]}
                  </span>
                </div>

                <div className="space-x-2">
                  <PermanentDeleteButton id={id} />

                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Button
                        size={"lg"}
                        variant="icon"
                        className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-110 hover:rotate-12 border border-white/20 shadow-lg group"
                        onClick={() => handleRestoreDeck(id)}
                      >
                        <ArchiveRestore className="w-5 h-5 group-hover:text-red-100 " />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique no botão para restaurar o deck.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="text-white bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 group/header">
                <h2 className="text-2xl font-bold text-center leading-relaxed capitalize line-clamp-2 group-hover/header:line-clamp-none group-hover/header:scale-105 group-hover/header:z-50 relative transition-all duration-300">
                  {name}
                </h2>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Deletado em{" "}
                    {new Date(deletedAt!).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

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
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
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
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        {renderContent()}
      </DrawerContent>
    </Drawer>
  );
};
