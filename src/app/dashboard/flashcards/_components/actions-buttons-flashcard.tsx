import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DeleteFlashcardButton } from "./delete-flashcard-button";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { memo } from "react";

const ActionsButtonsComponent = ({
  router,
  color,
  id,
}: {
  router: AppRouterInstance;
  color: string | null;
  id: string;
}) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      <DeleteFlashcardButton color={color || ""} id={id} />
      <Button
        variant={"icon"}
        title="Ver detalhes completos"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/dashboard/flashcards/${id}`);
        }}
        className="hover:-rotate-12"
      >
        <Info className="w-4 h-4  group-hover/btn:text-blue-100 hover:-rotate-12" />
      </Button>
    </div>
  );
};

export const ActionsButtonsFlashcard = memo(ActionsButtonsComponent);
ActionsButtonsFlashcard.displayName = "ActionsButtons";
