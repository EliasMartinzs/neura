import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CreateQuizForm, createQuizSchema } from "@/schemas/create-quiz.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Baby,
  CheckCircle2,
  FileText,
  Flame,
  Gauge,
  Sparkles,
  Target,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { ArrowRight, Lightbulb, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateQuiz } from "@/features/quiz/api/use-create-quiz";
import { useState } from "react";

const styles = [
  {
    value: "DIRECT",
    label: "Direto",
    icon: "🎯",
    desc: "Perguntas objetivas",
  },
  {
    value: "REAL_SCENARIO",
    label: "Cenário Real",
    icon: "🌍",
    desc: "Situações práticas",
  },
  {
    value: "TRICKY",
    label: "Desafiador",
    icon: "🧩",
    desc: "Pegadinhas inteligentes",
  },
  {
    value: "EXAM_LEVEL",
    label: "Nível Prova",
    icon: "📝",
    desc: "Estilo exame",
  },
];

const explanations = [
  { value: "SHORT", label: "Curta", icon: "⚡", desc: "Resposta rápida" },
  {
    value: "DETAILED",
    label: "Detalhada",
    icon: "📚",
    desc: "Explicação completa",
  },
  {
    value: "ANALOGY",
    label: "Analogia",
    icon: "🎭",
    desc: "Com exemplos do dia a dia",
  },
  {
    value: "PRACTICAL",
    label: "Prática",
    icon: "🛠️",
    desc: "Aplicação real",
  },
];

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

export const QuizForm = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<CreateQuizForm>({
    resolver: zodResolver(createQuizSchema),
    defaultValues: {
      topic: "",
      subtopic: "",
      difficulty: "EASY",
      explanationType: "DETAILED",
      style: "DIRECT",
      mode: "EVOLUTION",
    },
  });

  const { mutate, isPending } = useCreateQuiz();

  const isLoading = form.formState.isSubmitting || isPending;

  const handleCreateQuiz = (data: CreateQuizForm) => {
    mutate(data);
  };

  const handleNext = async () => {
    const isValid = await form.trigger(["topic", "subtopic"]);

    if (!isValid) {
      return;
    }
    setStep(2);
  };

  const handlePrev = () => {
    setStep(1);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuiz)}
        className="space-y-6 overflow-y-auto px-4"
      >
        <div className="space-y-8 ">
          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400 font-medium">
                Modo Evolução Ativado
              </span>
            </div>
            <h2 className="text-5xl font-bold bg-linear-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              Configure seu Quiz
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Personalize a experiência de aprendizado com IA. Escolha
              dificuldade, estilo e tipo de explicação.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem className="bg-white/5 backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Tema (Topico)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tema principal"
                        disabled={isLoading}
                        rows={4}
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
                  <FormItem className="bg-white/5 backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      Sub Tema (Sub Topico)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Tema principal"
                        disabled={isLoading}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === 2 && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Difficulty */}
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

              {/* Style */}
              <FormField
                control={form.control}
                name="style"
                render={({ field }) => (
                  <FormItem className="bg-slate-50 dark:bg-transparent backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Zap className="size-5 text-purple-400" />
                      Estilo
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {styles.map((style) => (
                          <button
                            key={style.value}
                            onClick={() => field.onChange(style.value)}
                            className={`w-full p-4 rounded-xl text-left transition-all ${
                              field.value === style.value
                                ? "bg-linear-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            }`}
                            type="button"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{style.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold">{style.label}</p>
                                <p className="text-xs text-slate-400">
                                  {style.desc}
                                </p>
                              </div>
                              {field.value === style.value && (
                                <CheckCircle2 className="size-5 text-purple-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Explanation */}
              <FormField
                control={form.control}
                name="explanationType"
                render={({ field }) => (
                  <FormItem className="bg-slate-50 dark:bg-transparent backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col">
                    <FormLabel className="font-bold flex items-center gap-2">
                      <Lightbulb className="size-5 text-yellow-400" />
                      Explicação
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {explanations.map((exp) => (
                          <button
                            key={exp.value}
                            onClick={() => field.onChange(exp.value)}
                            className={`w-full p-4 rounded-xl text-left transition-all ${
                              field.value === exp.value
                                ? "bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            }`}
                            type="button"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{exp.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold">{exp.label}</p>
                                <p className="text-xs text-slate-400">
                                  {exp.desc}
                                </p>
                              </div>
                              {field.value === exp.value && (
                                <CheckCircle2 className="size-5 text-yellow-400" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          <div className="flex items-center gap-x-3 justify-center pt-8">
            {step === 2 && (
              <Button
                variant={"gradientLife"}
                size={"lg"}
                type="button"
                onClick={handlePrev}
              >
                <ArrowLeft className="size-5 group-hover:translate-x-1 transition-transform" />
                Voltar
              </Button>
            )}
            {step === 1 && (
              <Button
                variant={"gradientLife"}
                size={"lg"}
                type="button"
                onClick={handleNext}
              >
                Proximo
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}

            {step === 2 && (
              <Button variant={"gradientLife"} size={"lg"} type="submit">
                Inciar Quiz
                <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
