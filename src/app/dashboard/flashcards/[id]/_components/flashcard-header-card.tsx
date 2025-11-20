import { Button } from "@/components/ui/button";
import { ChevronRight, Eye, EyeOff, Layers } from "lucide-react";

import { DeleteFlashcardButton } from "../../_components/delete-flashcard-button";

export const FlashcardHeaderCard = ({
  setShowStats,
  showStats,
  subtopic,
  topic,
  id,
}: {
  topic: string | null;
  subtopic: string | null;
  setShowStats: (prev: boolean) => void;
  showStats: boolean;
  id: string;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          {topic ? (
            <h1 className="text-2xl font-bold">{topic}</h1>
          ) : (
            "Nenhum tópico"
          )}
        </div>
        <p className="text-sm flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {subtopic ? subtopic : "Nenhum subtópico"}
        </p>
      </div>

      <div className="space-x-3">
        <Button variant="icon" onClick={() => setShowStats(!showStats)}>
          {showStats ? (
            <EyeOff className="w-4 h-4 mr-2" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          {showStats ? "Ocultar" : "Mostrar"} Estatísticas
        </Button>

        <DeleteFlashcardButton color={""} id={id} />
      </div>
    </div>
  );
};
