import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Tooltip } from "@/components/shared/tooltip";
import { Button } from "@/components/ui/button";

import { useState } from "react";

import { Plus } from "lucide-react";
import { QuizForm } from "./quiz-form";

export const CreateQuizButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button variant="ghost">
          <Tooltip
            trigger={<Plus className="size-5" />}
            content={<p className="text-sm">Criar quiz</p>}
          />
        </Button>
      }
      title=""
      width="min-w-7xl"
    >
      <QuizForm />
    </ResponsiveDialog>
  );
};
