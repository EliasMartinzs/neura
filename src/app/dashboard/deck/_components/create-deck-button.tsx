"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateDeckForm, createDeckSchema } from "@/schemas/create-deck.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { CirclePicker } from "react-color";
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { useCreateDeck } from "@/features/deck/api/use-create-deck";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { DIFFICULTY } from "@/constants/difficulty";
import { DeckDifficulty } from "@/generated/prisma/enums";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

export const CreateDeckButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button size={"lg"}>
          Criar novo deck <PlusCircle />
        </Button>
      }
      title="Novo deck"
    >
      <DeckForm close={setOpen} />
    </ResponsiveDialog>
  );
};

const DeckForm = ({ close }: { close: (prev: boolean) => void }) => {
  const form = useForm<CreateDeckForm>({
    resolver: zodResolver(createDeckSchema),
    defaultValues: {
      name: "",
      color: "",
      description: "",
      difficulty: "EASY",
      tags: [],
    },
  });

  const { mutate, isPending } = useCreateDeck();

  const isLoading = form.formState.isSubmitting || isPending;

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

  async function handleCreateDeck(data: CreateDeckForm) {
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
        onSubmit={form.handleSubmit(handleCreateDeck)}
        className="mx-2 space-y-6"
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

                    <Trash
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
            {isLoading ? <Loader2 className="size-5 animate-spin" /> : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
