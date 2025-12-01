import { Tooltip } from "@/components/shared/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bloomLevels } from "@/constants/bloom-level";
import { getForeground } from "@/constants/circle-colors";
import { FlashcardDifficulty } from "@/constants/flashcard-difficulty";
import { generatedModes } from "@/constants/generated";
import { useCreateFlashcardGenerationForm } from "@/features/flashcard/hooks/use-create-generation-flashcard-form";
import { useGenerateFlashcard } from "@/features/flashcard/hooks/use-generate-flashcard";
import { cn } from "@/lib/utils";
import { createFlashcardGenerationForm } from "@/schemas/create-flashcard-generattion.schema";
import { $Enums } from "@prisma/client";
import {
  ArrowLeft,
  ArrowRight,
  Baby,
  Brain,
  CheckCircle2,
  CirclePower,
  FileText,
  Flame,
  Gauge,
  HelpCircle,
  Layout,
  Loader2,
  Plus,
  Skull,
  Sparkles,
  SquareTerminal,
  Tag,
  Tally4Icon,
  Target,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const difficulties = [
  {
    value: "VERY_EASY",
    label: "Muito Fácil",
    icon: <Sparkles className="size-5 text-green-300" />,
    desc: "Conceitos introdutórios",
  },
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
  {
    value: "VERY_HARD",
    label: "Muito Difícil",
    icon: <Skull className="size-5 text-rose-600" />,
    desc: "Domínio profundo e extremamente complexo",
  },
];

export const FlashcardGeneration = ({
  close,
  decks,
  router,
  isLoadingDeckNames,
  deckId,
}: {
  close: (close: boolean) => void;
  decks:
    | {
        id: string;
        name: string;
        color: string | null;
        difficulty: $Enums.DeckDifficulty | null;
        _count: {
          flashcards: number;
        };
      }[]
    | null
    | undefined;
  router: AppRouterInstance;
  isLoadingDeckNames: boolean;
  deckId?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { step, nextStep, prevStep, form } = useCreateFlashcardGenerationForm({
    deckId,
  });
  const { mutateAsync, isPending } = useGenerateFlashcard();

  const isLoading = form.formState.isSubmitting || isPending;

  async function handleCreateFlashcardGeneration(
    data: createFlashcardGenerationForm
  ) {
    close(false);

    toast.loading("Gerando flashcards...", {
      id: "generate-flashcard",
    });

    mutateAsync(data)
      .then(() => {
        toast.success("Flashcards gerados com sucesso!", {
          id: "generate-flashcard",
        });
      })
      .catch(() => {
        toast.error("Erro ao gerar flashcards", {
          id: "generate-flashcard",
        });
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateFlashcardGeneration)}
        className="space-y-8 px-4 pt-6 overflow-y-auto transition-all duration-200 ease-in"
      >
        {isLoading && (
          <div className="flex items-center justify-center my-10 gap-x-3">
            <Sparkles className="text-primary size-14 animate-pulse" />{" "}
            <p className="text-xl text-muted-foreground animate-pulse">
              Gerando...
            </p>
          </div>
        )}

        {step === 1 && (
          <FormField
            control={form.control}
            name="deckId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-x-3">
                  <Layout className="size-5 text-primary" />

                  <span>Deck</span>
                  <Tooltip
                    content="Escolha o deck que vai armazenar este flashcard. Assim, ele ficará organizado junto aos temas correspondentes."
                    trigger={
                      <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                    }
                  />
                </FormLabel>
                <FormControl>
                  {decks?.length === 0 ? (
                    <div className="space-y-4 flex items-center justify-center flex-col my-4">
                      <p className="text-muted-foreground">
                        Nenhum deck foi criado ainda. Crie um deck para poder
                        adicionar seus flashcards.
                      </p>

                      <Button
                        onClick={() => {
                          router.push("/dashboard/deck?open-modal-deck=true");
                          toast.success(
                            "Redirecionando para a criação do deck..."
                          );
                        }}
                        variant={"outline"}
                      >
                        <Plus /> Crie um deck clicando aqui
                      </Button>
                    </div>
                  ) : isLoadingDeckNames ? (
                    <Loader2 className="animate-spin" />
                  ) : !decks ? (
                    <div>Houve um erro, tente novamente</div>
                  ) : (
                    <div className="max-h-[30dvh] overflow-y-auto space-y-6">
                      <Input
                        placeholder="Buscar deck..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(e.target.value.toLowerCase())
                        }
                      />
                      <div
                        className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}
                      >
                        {decks
                          .filter((d) =>
                            d.name.toLowerCase().includes(searchTerm)
                          )
                          .map((deck) => (
                            <Card
                              key={deck.id}
                              className="hover:scale-97 transition-transform transform duration-500"
                              onClick={() => {
                                field.onChange(deck.id);
                                nextStep();
                              }}
                              style={{
                                backgroundColor: deck.color || "",
                                color: getForeground(deck.color || ""),
                              }}
                            >
                              <CardHeader>
                                <CardTitle className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
                                  <h2 className="text-xl font-bold text-center leading-relaxed capitalize line-clamp-1">
                                    {deck.name}
                                  </h2>
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-center gap-3 mt-4 bg-white/10 rounded-lg p-3">
                                  <div className="flex gap-1">
                                    {[
                                      "VERY_EASY",
                                      "EASY",
                                      "MEDIUM",
                                      "HARD",
                                      "VERY_HARD",
                                    ].map((level, index) => {
                                      const isActive =
                                        [
                                          "VERY_EASY",
                                          "EASY",
                                          "MEDIUM",
                                          "HARD",
                                          "VERY_HARD",
                                        ].indexOf(
                                          deck.difficulty as $Enums.DeckDifficulty
                                        ) >= index;
                                      return (
                                        <div
                                          key={level}
                                          className={`w-1.5 h-5 rounded-full transition-all duration-300 ${
                                            isActive
                                              ? "bg-linear-to-t from-yellow-400 to-yellow-200 shadow-lg"
                                              : "bg-white/20"
                                          }`}
                                        ></div>
                                      );
                                    })}
                                  </div>
                                  <span className=" text-sm font-semibold">
                                    {FlashcardDifficulty[
                                      deck.difficulty as $Enums.DeckDifficulty
                                    ].label || deck.difficulty}
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {step === 2 && (
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
                  <div className="space-y-2">
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
        )}

        {step === 3 && (
          <>
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="flex items-center gap-x-3">
                    <Tag className="size-5 text-primary" />

                    <span>Qual é o tema principal?</span>
                    <Tooltip
                      content={
                        <div className="space-y-4">
                          <p>
                            É o assunto central ou tema geral da pergunta. Pense
                            como uma “categoria” que agrupa várias perguntas
                            relacionadas.
                          </p>

                          <div className="flex flex-col gap-1">
                            <strong>Exemplo:</strong>
                            <div>
                              <p>História → (Unificação da China)</p>
                              <p>Matemática → (Funções quadráticas)</p>
                              <p>Biologia → (Fotossíntese)</p>
                              <p>Programação → (JavaScript básico)</p>
                            </div>
                          </div>
                        </div>
                      }
                      trigger={
                        <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                      }
                    />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="História → (Unificação da China)"
                      disabled={isLoading}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtopic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-3">
                    <FileText className="size-5 text-primary" />

                    <span>Deseja especificar um subtópico? (opcional)</span>
                    <Tooltip
                      content={
                        <div className="space-y-4">
                          <p>
                            É uma divisão dentro do tópico, focando em um ponto
                            mais específico da pergunta.
                          </p>

                          <div className="flex flex-col gap-1">
                            <strong>Exemplo:</strong>
                            <div className="space-y-1">
                              <p>
                                Tópico: Fotossíntese → Subtópico: Fase clara e
                                fase escura
                              </p>
                              <p>
                                Tópico: Funções quadráticas → Subtópico: Vértice
                                e concavidade
                              </p>
                              <p>
                                Tópico: JavaScript básico → Subtópico: Funções
                                assíncronas (async/await)
                              </p>
                              <p>
                                Tópico: Unificação da China → Subtópico:
                                Dinastia Qin e o imperador Qin Shi Huang
                              </p>
                            </div>
                          </div>
                        </div>
                      }
                      trigger={
                        <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                      }
                    />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="História → (Unificação da China)"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="flex items-center gap-x-3">
                    <SquareTerminal className="size-5 text-primary" />
                    Sobre o que você quer criar flashcards?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Explica a unificação da China. (Max 300. Caracteres)"
                      rows={4}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="flex items-center gap-x-3">
                    <Tally4Icon className="size-5 text-primary" />
                    Quantos flashcards você quer gerar?
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {step === 4 && (
          <>
            <FormField
              control={form.control}
              name="bloomLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-3">
                    <Brain className="size-5 text-primary" />

                    <span>Bloom Level</span>
                    <Tooltip
                      content={
                        <div className="space-y-4 text-center p-4">
                          <p className="font-medium">
                            O Bloom Level vem da Taxonomia de Bloom, uma forma
                            de classificar o nível de complexidade do pensamento
                            envolvido em uma pergunta ou tarefa. Ele ajuda a
                            entender qual tipo de raciocínio a pergunta exige —
                            desde lembrar algo simples até criar algo novo.
                          </p>

                          <Link
                            href={"/dashboard/about/bloom-level"}
                            className={buttonVariants({
                              size: "lg",
                            })}
                          >
                            Clique aqui entender como Bloom level funciona
                          </Link>
                        </div>
                      }
                      trigger={
                        <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                      }
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-3 gap-2">
                      {bloomLevels.map(
                        ({ description, icon, label, value }, index) => (
                          <div
                            key={index}
                            className={cn(
                              "border p-4 rounded-xl flex flex-col items-start justify-center text-base gap-1 hover:outline transition-all duration-200 ease-in",
                              form.getValues("bloomLevel") === value
                                ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            )}
                            onClick={() => field.onChange(value)}
                          >
                            <span className="text-xl">{icon}</span>
                            <strong>{label}</strong>

                            <p>{description}</p>
                          </div>
                        )
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="generationMode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-3">
                    <CirclePower className="size-5 text-primary" />
                    Modo de geração
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {generatedModes.map(({ desc, icon, label, value }) => (
                        <button
                          key={value}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            field.value === value
                              ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => field.onChange(value)}
                          type="button"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold">{label}</p>
                              <p className="text-xs text-slate-400">{desc}</p>
                            </div>
                            {field.value === value && (
                              <CheckCircle2 className="size-5 text-blue-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </>
        )}

        <div className={cn("flex justify-end gap-2", isLoading && "hidden")}>
          {step > 1 && (
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={prevStep}
              disabled={step === 2 && deckId ? true : false}
              type="button"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
              <span className="font-medium">Voltar</span>
            </Button>
          )}
          {step > 1 && step < 4 && (
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={nextStep}
              type="button"
            >
              <span className="font-medium">Próximo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          )}
          {step === 4 && (
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={nextStep}
              type="submit"
            >
              {isLoading ? (
                <Sparkles className="w-5 h-5 transition-transform duration-300 animate-pulse" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 transition-transform duration-300 animate-pulse" />
                  <span className="font-medium">Criar card</span>
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
