import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useMoveDeckToTrash } from "@/features/deck/api/use-move-deck-to-trash";

import { Trash } from "lucide-react";
import { useState } from "react";

export const MoveTrashButton = ({
  id,
  textColor,
}: {
  id: string;
  textColor: string;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMoveDeckToTrash();

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
      title="Enviar deck para a lixeira"
      description="Ele permanecerá na lixeira por 30 dias e pode ser restaurado a qualquer momento antes da exclusão definitiva."
      trigger={
        <Button variant={"ghost"} style={{ color: textColor }}>
          <Trash />
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
        <Button onClick={handleDeleteDeck} disabled={isPending}>
          Deletar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
