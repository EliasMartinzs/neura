import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAllDecks } from "@/features/deck/api/use-delete-all-decks";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export const DeleteAllDecksFromTrash = ({
  ids,
  onClose,
}: {
  ids: string[];
  onClose: (close: boolean) => void;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useDeleteAllDecks();

  async function handleDeleteDeck() {
    mutate(
      {
        ids,
      },
      {
        onSuccess: () => {
          setOpen(false);
          onClose(false);
        },
      }
    );
  }
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Esvaziar lixeira"
      description="Esta ação removerá permanentemente todos os decks da lixeira, incluindo seus cartões e dados associados. Depois de confirmada, não será possível restaurar nenhum conteúdo."
      trigger={
        <Button
          variant={"destructive"}
          className="p-6 text-lg"
          type="submit"
          disabled={isPending}
        >
          <span className="relative flex items-center gap-2 ">
            {isPending ? (
              <>
                <Sparkles className="size-5 animate-pulse" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Deletar todos os items
              </>
            )}
          </span>
        </Button>
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
        <Button
          variant={"destructive"}
          onClick={handleDeleteDeck}
          disabled={isPending}
        >
          Confrimar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
