import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { usePermanentlyDeleteDeck } from "@/features/deck/api/use-permanently-delete-deck";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const PermanentDeleteButton = ({
  id,
  textColor,
}: {
  id: string;
  textColor: string;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = usePermanentlyDeleteDeck();

  async function handleDeleteDeck() {
    mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  }
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Excluir deck permanentemente"
      description="Esta ação removerá definitivamente o deck e todos os dados relacionados, incluindo flashcards, anotações e estatísticas. Essa operação não pode ser desfeita."
      trigger={
        <button style={{ color: textColor }}>
          <Trash2 className="size-5 text-muted-foreground hover:text-foreground duration-200 transition-all ease-in" />
        </button>
      }
    >
      <div className="w-full flex items-center justify-end gap-x-3">
        <Button
          variant={"ghost"}
          onClick={() => setOpen(false)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button onClick={handleDeleteDeck} disabled={isPending}>
          Deletar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
