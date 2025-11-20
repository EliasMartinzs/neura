"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Plus, Sparkles } from "lucide-react";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

import { useRouter, useSearchParams } from "next/navigation";
import { DeckForm } from "./deck-form";

export const CreateDeckButton = () => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const openModalDeck = searchParams.get("open-modal-deck");

  useEffect(() => {
    if (openModalDeck) {
      setOpen(true);
    }
  }, [openModalDeck, router]);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={() => {
        setOpen((open) => !open);
        const newUrl = window.location.pathname;
        router.replace(newUrl);
      }}
      trigger={
        <Button variant="outline" className="">
          Novo deck <Plus className="w-5 h-5" />
        </Button>
      }
      title=""
    >
      <div className="overflow-y-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full shadow-sm mb-4">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Criar Novo Deck</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground/70 via-primary/70 to-foreground/25 bg-clip-text text-transparent">
            Monte seu Deck
          </h1>
          <p className="text-foreground mt-2">
            Organize seus estudos de forma inteligente
          </p>
        </div>

        <DeckForm close={setOpen} />
      </div>
    </ResponsiveDialog>
  );
};
