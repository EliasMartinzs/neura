import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import { usePermanentlyDeleteDeck } from "@/features/deck/api/use-permanently-delete-deck";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export const PermanentDeleteButton = ({ id }: { id: string }) => {
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
