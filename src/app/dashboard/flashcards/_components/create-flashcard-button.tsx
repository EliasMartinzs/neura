"use client";

import { useEffect, useState } from "react";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { useGetDeckNames } from "@/features/deck/api/use-get-deck-names";
import { useRouter, useSearchParams } from "next/navigation";

import { Switch } from "@/components/ui/switch";
import { Brain, Sparkles, User } from "lucide-react";
import { FlashcardForm } from "./flashcard-form";
import { FlashcardGeneration } from "./flashcard-generation";

export const CreateFlashcardButton = ({
  trigger,
  deckId,
}: {
  trigger: React.ReactNode;
  deckId?: string;
}) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const openModalFlashcard = searchParams.get("open-modal-flashcard");
  const [type, setType] = useState(false);

  useEffect(() => {
    if (openModalFlashcard) {
      setOpen(true);
    }
  }, [openModalFlashcard, router]);

  const { decks, isLoading } = useGetDeckNames({});

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={() => {
        setOpen((open) => !open);
        const newUrl = window.location.pathname;
        router.replace(newUrl);
      }}
      trigger={trigger}
      title=""
    >
      <div className="mb-8 text-center animate-fade-in overflow-y-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full shadow-sm mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium">Criar Novo flashcard</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground/70 via-primary/70 to-foreground/25 bg-clip-text text-transparent">
          Monte seu Flashcard
        </h1>
        <p className="text-foreground mt-2">
          Organize seus estudos de forma inteligente
        </p>

        <div className="w-full flex items-center justify-center mt-10">
          <div className="flex items-center gap-4">
            <p className="inline-flex items-center gap-x-3">
              <User className="size-5 text-primary" /> Manual
            </p>
            <Switch checked={type} onCheckedChange={(e) => setType(e)} />
            <p className="inline-flex items-center gap-x-3">
              Gerar com IA
              <Brain className="size-5 text-primary" />
            </p>
          </div>
        </div>

        <div className="my-4">
          {!type ? (
            <FlashcardForm
              close={setOpen}
              decks={decks}
              router={router}
              openModalFlashcard={openModalFlashcard}
              isLoadingDeckNames={isLoading}
              deckId={deckId}
            />
          ) : (
            <FlashcardGeneration
              close={setOpen}
              decks={decks}
              router={router}
              isLoadingDeckNames={isLoading}
              deckId={deckId}
            />
          )}
        </div>
      </div>
    </ResponsiveDialog>
  );
};
