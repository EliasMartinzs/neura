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
import { useForm } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { useCreateDeck } from "@/features/deck/api/use-create-deck";

import { Button } from "@/components/ui/button";
import { circleColors } from "@/constants/circle-colors";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  CheckCircle2,
  FileText,
  Flame,
  Gauge,
  Palette,
  Plus,
  Sparkles,
  Tag,
  Target,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";

const difficulties = [
  {
    value: "EASY",
    label: "Fácil",
    icon: <Baby className="size-5 text-green-500" />,
    desc: "Conceitos básicos",
  },
  {
    value: "MEDIUM",
    label: "Médio",
    icon: <Gauge className="size-5 text-orange-500" />,
    desc: "Conhecimento intermediário",
  },
  {
    value: "HARD",
    label: "Difícil",
    icon: <Flame className="size-5 text-red-500" />,
    desc: "Desafios avançados",
  },
];

export const DeckForm = ({ close }: { close: (prev: boolean) => void }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const inputRef = useRef<HTMLInputElement | null>(null);
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

  const addTag = (value: string) => {
    const tag = value.trim();
    if (!tag) return;

    if (/\s/.test(tag)) {
      form.setError("tags", {
        type: "manual",
        message: "Tags não podem conter espaços.",
      });
      console.warn("Tag inválida: contém espaços");
      return;
    }

    const currentTags = form.getValues("tags") || [];

    if (!currentTags.includes(tag)) {
      form.setValue("tags", [...currentTags, tag], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleAddTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(e.currentTarget.value);
      e.currentTarget.value = "";
    }
  };

  const handleAddTagClick = () => {
    if (!inputRef.current) return;
    addTag(inputRef.current.value);
    inputRef.current.value = "";
  };

  const handleRemoveTag = (tag: string) => {
    const updated = form.getValues("tags")?.filter((t) => t !== tag);
    form.setValue("tags", updated);
  };

  async function handleCreateDeck(data: CreateDeckForm) {
    mutate(data, {
      onSuccess: ({ data }) => {
        close(false);
        form.reset();
      },
    });
  }

  const handleNext = async () => {
    const isValid = await form.trigger(["name", "description", "tags"]);

    if (!isValid) return;

    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateDeck)}
        className="space-y-6 overflow-y-auto px-4"
      >
        {step === 1 && (
          <>
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    <Tag className="w-4 h-4 text-primary" />
                    Tags
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-3">
                      <Input
                        ref={inputRef}
                        placeholder="Insira uma tag e pressione Enter (uma por vez)."
                        onKeyDown={handleAddTagKey}
                        disabled={isLoading}
                      />

                      <Button
                        variant={"ghost"}
                        className="h-full"
                        onClick={handleAddTagClick}
                        type="button"
                      >
                        <Plus className="size-5" />
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />

                  <div className="flex items-center gap-3 flex-wrap overflow-hidden">
                    {form.watch("tags")?.map((tag, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-2 px-4 py-2 border rounded-md font-medium shadow-md hover:shadow-lg"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span className="text-sm">{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          disabled={isLoading}
                          className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </FormItem>
              )}
            />
          </>
        )}

        {step == 2 && (
          <>
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
                    <div className="grid grid-cols-10 gap-3 mt-1">
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
              name="difficulty"
              render={({ field }) => (
                <FormItem className="bg-slate-50 dark:bg-transparent backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col">
                  <FormLabel className="font-bold flex items-center gap-2">
                    <Target className="size-5 text-blue-400" />
                    Dificuldade
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2 m-1">
                      {difficulties.map((diff) => (
                        <button
                          key={diff.value}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            field.value === diff.value
                              ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => field.onChange(diff.value)}
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{diff.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold">{diff.label}</p>
                              <p className="text-xs text-slate-400">
                                {diff.desc}
                              </p>
                            </div>
                            {field.value === diff.value && (
                              <CheckCircle2 className="size-5 text-blue-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="w-full flex justify-end gap-x-3">
          {step === 2 && (
            <Button
              type="button"
              disabled={isLoading}
              variant={"outline"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={handlePrev}
            >
              <ArrowLeft className="size-5" /> Voltar
            </Button>
          )}
          {step === 1 && (
            <Button
              type="button"
              disabled={isLoading}
              variant={"outline"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={handleNext}
            >
              Proximo <ArrowRight className="size-5" />
            </Button>
          )}
          {step === 2 && (
            <Button
              type="submit"
              disabled={isLoading}
              variant={"outline"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
            >
              <span className="relative flex items-center gap-2 text-white dark:text-foreground">
                {isLoading ? (
                  <>
                    <Sparkles className="size-5 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Criar Deck
                  </>
                )}
              </span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
