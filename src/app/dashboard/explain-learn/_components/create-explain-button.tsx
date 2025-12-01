"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { ExplainQuestionForm } from "./explain-question-form";
import { Tooltip } from "@/components/shared/tooltip";

export const CreateExplainQuestionButton = () => {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen((prev) => !prev);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={() => {
        setOpen((open) => !open);
      }}
      trigger={
        <Button variant="ghost">
          <Tooltip
            trigger={<Plus className="size-5" />}
            content={<p className="text-sm">Criar quiz</p>}
          />
        </Button>
      }
      title=""
    >
      <div className="overflow-y-auto">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full shadow-sm mb-4">
            <Lightbulb className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">Iniciar Sessão</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground/70 via-primary/70 to-foreground/25 bg-clip-text text-transparent">
            Explique e Aprenda
          </h1>
          <p className="text-foreground mt-2">
            Responda perguntas abertas e receba feedback imediato da IA
          </p>
        </div>

        <ExplainQuestionForm onClose={onClose} />
      </div>
    </ResponsiveDialog>
  );
};
