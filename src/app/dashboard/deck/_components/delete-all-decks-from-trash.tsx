import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAllDecks } from "@/features/deck/api/use-delete-all-decks";
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
        <Button size={"lg"} variant={"destructive"}>
          Deletar todos os itens da lixeira
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
