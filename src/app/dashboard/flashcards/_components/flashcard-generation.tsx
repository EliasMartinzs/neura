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
import { FlashcardDifficulty } from "@/constants/flashcard-difficulty";
import { GENERATED } from "@/constants/generated";
import { useCreateFlashcardGenerationForm } from "@/features/flashcard/hooks/use-create-generation-flashcard-form";
import { useGenerateFlashcard } from "@/features/flashcard/hooks/use-generate-flashcard";
import { cn } from "@/lib/utils";
import { createFlashcardGenerationForm } from "@/schemas/create-flashcard-generattion.schema";
import {
  ArrowLeft,
  ArrowRight,
  Book,
  Brain,
  CirclePower,
  FileText,
  HelpCircle,
  Layout,
  Loader2,
  Sparkles,
  SquareTerminal,
  Tag,
  Tally4Icon,
  Zap,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { toast } from "sonner";

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
  const { step, nextStep, prevStep, form } = useCreateFlashcardGenerationForm({
    deckId,
  });
  const { mutate, isPending } = useGenerateFlashcard();

  const isLoading = form.formState.isSubmitting || isPending;

  async function handleCreateFlashcardGeneration(
    data: createFlashcardGenerationForm
  ) {
    mutate(data, {
      onSuccess: ({ code }) => {
        if (code === 201) {
          router.push(`/dashboard/deck/${form.getValues("deckId")}`);
          close(false);
        }
      },
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

        {step === 1 && !isLoading && (
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
                    <div className="space-y-2 flex items-center justify-center flex-col">
                      <p>
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
                      >
                        Crie um deck clicando aqui
                      </Button>
                    </div>
                  ) : isLoadingDeckNames ? (
                    <Loader2 className="animate-spin" />
                  ) : !decks ? (
                    <p>Houve um erro, tente novamente</p>
                  ) : (
                    <div className="space-y-4 max-h-[70svh]">
                      <div
                        className={cn("grid grid-cols-1 md:grid-cols-2 gap-4")}
                      >
                        {decks.map((deck) => (
                          <Card
                            key={deck.id}
                            style={{
                              background: `linear-gradient(135deg, ${deck.color}33, ${deck.color}88)`,
                            }}
                            className="min-w-52"
                            onClick={() => {
                              field.onChange(deck.id);
                              nextStep();
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = deck.color!;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = `linear-gradient(135deg, ${deck.color}33, ${deck.color}88)`;
                            }}
                          >
                            <CardHeader>
                              <CardTitle>{deck.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-x-3">
                                <Book className="size-5 text-primary" />{" "}
                                {Number(deck._count.flashcards)} cards
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

        {step === 2 && !isLoading && (
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

        {step === 3 && !isLoading && (
          <>
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-x-3">
                    <Zap className="size-5 text-primary" />

                    <span>Dificuldade</span>
                    <Tooltip
                      content="Selecione o nível de dificuldade da pergunta. Escolha o quanto ela parece fácil ou desafiadora para você."
                      trigger={
                        <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                      }
                    />
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-4">
                      {Object.entries(FlashcardDifficulty).map(
                        ([key, value]) => {
                          const Icon = value.icon;

                          return (
                            <div
                              key={key}
                              className={cn(
                                "flex items-center gap-x-2 border p-2 rounded-xl group duration-200 ease-in transition-all shadow hover:outline",
                                form.watch("difficulty") === key &&
                                  "bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white"
                              )}
                              onClick={() => field.onChange(key)}
                            >
                              <Icon
                                className={cn(
                                  "text-primary size-5",
                                  form.watch("difficulty") === key &&
                                    "text-primary-foreground"
                                )}
                              />{" "}
                              {value.label}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                              form.getValues("bloomLevel") === value &&
                                "bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white"
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
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(GENERATED).map(([key, value]) => (
                        <Button
                          key={key}
                          onClick={() => field.onChange(key)}
                          type="button"
                          variant={"outline"}
                          className={cn(
                            form.watch("generationMode") === key &&
                              "bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white"
                          )}
                        >
                          {value}
                        </Button>
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
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
              <span className="font-medium">Voltar</span>
            </Button>
          )}
          {step > 1 && step < 3 && (
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              onClick={nextStep}
            >
              <span className="font-medium">Próximo</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          )}
          {step === 3 && (
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
            >
              <Sparkles className="w-5 h-5 transition-transform duration-300 animate-pulse" />
              <span className="font-medium">Gerar</span>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
