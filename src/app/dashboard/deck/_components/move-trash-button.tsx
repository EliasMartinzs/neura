import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { useMoveDeckToTrash } from "@/features/deck/api/use-move-deck-to-trash";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const MoveTrashButton = ({
  id,
  redirect,
}: {
  id: string;
  redirect?: string;
}) => {
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
        <Button
          size={"lg"}
          variant="icon"
          className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-red-500/30 transition-all duration-300 hover:scale-110 hover:rotate-12 border border-white/20 shadow-lg group"
        >
          <Trash2 className="w-5 h-5 group-hover:text-red-100 " />
        </Button>
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
