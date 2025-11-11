import { Button } from "@/components/ui/button";
import { getForeground } from "@/constants/circle-colors";
import { useDeleteFlashcard } from "@/features/flashcard/api/use-delete-flashcard";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

type Props = {
  id: string;
  color: string;
};

export const DeleteFlashcardButton = ({ id, color }: Props) => {
  const [open, setOpen] = useState(false);
  const { mutate } = useDeleteFlashcard();

  async function handleDeleteFlashcard(id: string) {
    mutate(
      { id },
      {
        onSuccess: () => {
          setOpen((prev) => !prev);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"icon"} className="hover:rotate-12">
          <Trash2
            className={cn(
              "w-4 h-4  group-hover/btn:text-red-300",
              getForeground(color || "")
            )}
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar flashcard permanentemente</DialogTitle>
          <DialogDescription>
            Tem certeza de que deseja deletar este flashcard? Essa ação é
            irreversível — uma vez deletado, não será possível recuperar os
            dados.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="w-full justify-end">
          <Button
            variant={"outline"}
            title="Deletar flashcard"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            variant={"destructive"}
            title="Deletar flashcard"
            onClick={(e) => {
              handleDeleteFlashcard(id);
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
