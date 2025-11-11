"use client";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { DIFFICULTY } from "@/constants/difficulty";
import { useEditDeck } from "@/features/deck/api/use-edit-deck";
import client from "@/lib/hc";
import { cn } from "@/lib/utils";
import { editDeckSchema, type EditDeckForm } from "@/schemas/edit-deck.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeckDifficulty } from "@prisma/client";
import { InferResponseType } from "hono";
import { Edit3, Loader2, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CirclePicker } from "react-color";
import { useForm } from "react-hook-form";

type DeckResponse = InferResponseType<typeof client.api.deck.$get>;

type Deck = NonNullable<NonNullable<DeckResponse>["data"]>[number];

type Props = {
  deck: Deck;
};

export const EditDeckButton = ({ deck }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button
          size={"lg"}
          variant="icon"
          className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-blue-500/30 transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-white/20 shadow-lg group"
        >
          <Edit3 className="w-5 h-5 group-hover:text-green-100 " />
        </Button>
      }
      title=""
    >
      <div className="mb-8 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full shadow-sm mb-4">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-sm font-medium">Editar</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-foreground/70 via-primary/70 to-foreground/25 bg-clip-text text-transparent">
          Editar meu deck
        </h1>
      </div>
      <EditDeckForm deck={deck} close={setOpen} />
    </ResponsiveDialog>
  );
};

const EditDeckForm = ({
  deck,
  close,
}: {
  deck: Deck;
  close: (prev: boolean) => void;
}) => {
  const form = useForm<EditDeckForm>({
    resolver: zodResolver(editDeckSchema),
    defaultValues: {
      id: deck.id,
      name: deck.name,
      description: deck.description || "",
      color: deck.color || "",
      difficulty: deck.difficulty || "EASY",
      tags: deck.tags,
    },
  });

  const { mutate, isPending } = useEditDeck();
  const isLoading = form.formState.isSubmitting || isPending;

  useEffect(() => {
    if (deck) {
      form.reset({
        id: deck.id,
        name: deck.name,
        description: deck.description || "",
        color: deck.color || "",
        difficulty: deck.difficulty || "EASY",
        tags: deck.tags,
      });
    }
  }, [deck, form]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (!value) return;
      const currentTags = form.getValues("tags") || [];
      if (!currentTags.includes(value)) {
        form.setValue("tags", [...currentTags, value], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      e.currentTarget.value = "";
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updated = form.getValues("tags")?.filter((t) => t !== tag);
    form.setValue("tags", updated);
  };

  async function handleEditDeck(data: EditDeckForm) {
    mutate(data, {
      onSuccess: () => {
        close(false);
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleEditDeck)}
        className="m-4 space-y-6 overflow-y-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  placeholder="Estudos gerais"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <FormControl>
                <CirclePicker
                  className={cn(
                    "min-w-full flex items-center justify-center mt-2"
                  )}
                  onChange={(e) => field.onChange(e.hex)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Descrição sobre os estudos do deck"
                  rows={7}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dificuldade</FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <NativeSelectOption value={""}>
                    Selecione uma dificuldade
                  </NativeSelectOption>
                  {Object.values(DeckDifficulty).map((item) => (
                    <NativeSelectOption key={item} value={item}>
                      {DIFFICULTY[item]}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags (Biografia)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Insira uma tag e pressione Enter (uma por vez)."
                  onKeyDown={handleAddTag}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />

              <div className="flex items-center gap-3 flex-wrap overflow-hidden">
                {form.watch("tags")?.map((tag) => (
                  <div
                    key={tag}
                    className="border py-2 px-3 flex items-center gap-x-2 rounded-full hover:border-primary hover:bg-primary transition-colors duration-200 ease-in"
                  >
                    <span>{tag}</span>

                    <Trash2
                      className="size-4"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
