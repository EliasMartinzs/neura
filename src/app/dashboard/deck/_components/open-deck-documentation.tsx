import { Tooltip } from "@/components/shared/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { useDeckDocumentation } from "@/features/deck/hooks/use-deck-documentation";
import { Book, BookOpen } from "lucide-react";

export const OpenDeckDocumentation = () => {
  const { open, onOpen, onClose } = useDeckDocumentation();

  const handleShowDocumentation = () => {
    open ? onClose() : onOpen();
  };

  return (
    <Tooltip
      trigger={
        <div
          className={buttonVariants({ variant: "ghost" })}
          onClick={handleShowDocumentation}
        >
          {open ? (
            <BookOpen className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          ) : (
            <Book className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
          )}
        </div>
      }
      content={<p className="text-sm">Como funciona os decks</p>}
    />
  );
};
