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
import { circleColors } from "@/constants/circle-colors";
import { DIFFICULTY } from "@/constants/difficulty";
import { useEditDeck } from "@/features/deck/api/use-edit-deck";
import client from "@/lib/hc";
import { cn } from "@/lib/utils";
import { editDeckSchema, type EditDeckForm } from "@/schemas/edit-deck.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeckDifficulty } from "@prisma/client";
import { InferResponseType } from "hono";
import {
  Edit3,
  FileText,
  Loader2,
  Palette,
  Sparkles,
  Tag,
  Target,
  Trash2,
} from "lucide-react";
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
        className="px-4 space-y-6 overflow-y-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="w-4 h-4 text-primary" />
                Nome do Deck
              </FormLabel>
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
              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                <Palette className="w-4 h-4 text-primary" />
                Cor do Deck
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-10 gap-3">
                  {circleColors.map((color) => (
                    <button
                      key={color.background}
                      type="button"
                      onClick={() => field.onChange(color.background)}
                      disabled={isLoading}
                      className={`w-full aspect-square rounded-xl transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                        field.value === color.background
                          ? "ring-1 ring-offset-1 ring-purple-500 scale-110"
                          : "hover:ring-2 ring-slate-300"
                      }`}
                      style={{ backgroundColor: color.background }}
                    />
                  ))}
                </div>
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
              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="w-4 h-4 text-primary" />
                Descrição
              </FormLabel>
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
              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                <Target className="w-4 h-4 text-purple-500" />
                Nível de Dificuldade
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  {Object.entries(DIFFICULTY).map(([key, value]) => (
                    <button
                      onClick={() => field.onChange(key)}
                      key={key}
                      type="button"
                      className={`relative flex-1 overflow-hidden px-4 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        field?.value === key
                          ? "ring-1 bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white dark:text-foreground"
                          : "ring-1 ring-slate-200 hover:ring-slate-300"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
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
              <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="w-4 h-4 text-primary" />
                Tags
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Insira uma tag e pressione Enter (uma por vez)."
                  onKeyDown={handleAddTag}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />

              <div className="flex items-center gap-3 flex-wrap overflow-hidden">
                {form.watch("tags")?.map((tag, index) => (
                  <div
                    key={index}
                    className="group flex items-center gap-2 px-4 py-2 bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 animate-pop-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <span className="text-sm text-white">{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isLoading}
                      className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />

        <div className="w-full flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="group relative overflow-hidden px-8 py-4 bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <span className="relative flex items-center gap-2 text-white dark:text-foreground">
              {isLoading ? (
                <>
                  <Sparkles className="size-5 animate-pulse" />
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Salvar
                </>
              )}
            </span>
          </button>
        </div>
      </form>
    </Form>
  );
};
