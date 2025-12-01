import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useMoveDeckToTrash } from "@/features/deck/api/use-move-deck-to-trash";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  redirect?: string;
  trigger?: React.ReactNode;
};

export const MoveTrashButton = ({ id, redirect, trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { mutate, isPending } = useMoveDeckToTrash();

  async function handleDeleteDeck() {
    mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          setOpen(false);
          if (redirect) router.push(redirect);
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
        trigger ? (
          trigger
        ) : (
          <button className="flex items-center gap-x-3 hover:bg-accent w-full p-3 rounded-xl">
            <Trash2 className="size-4" /> Deletar
          </button>
        )
      }
    >
      <div className="w-full flex items-center max-lg:justify-center justify-end gap-x-3">
        <Button
          variant={"outline"}
          size={"lg"}
          onClick={() => setOpen(false)}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDeleteDeck}
          disabled={isPending}
          variant={"destructive"}
          size={"lg"}
        >
          Deletar
        </Button>
      </div>
    </ResponsiveDialog>
  );
};
