import { Tooltip } from "@/components/shared/tooltip";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useCreateExplainQuestion } from "@/features/explain-learn/api/use-create-explain-question";
import {
  createExplainQuestion,
  CreateExplainQuestionForm,
} from "@/schemas/create-explain-question.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Baby,
  CheckCircle2,
  Flame,
  Gauge,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

type Props = {
  onClose: () => void;
};

export const ExplainQuestionForm = ({ onClose }: Props) => {
  const form = useForm<CreateExplainQuestionForm>({
    resolver: zodResolver(createExplainQuestion),
    defaultValues: {
      topic: "",
      difficulty: "EASY",
    },
  });

  const { mutateAsync, isPending } = useCreateExplainQuestion();

  const isLoading = form.formState.isSubmitting || isPending;

  async function handleCreateTopic(data: CreateExplainQuestionForm) {
    onClose();

    toast.loading("Gerando pergunta...", {
      id: "generate-question",
    });

    mutateAsync(data)
      .then(() => {
        toast.success("Pergunta gerada com sucesso!", {
          id: "generate-question",
        });
      })
      .catch(() => {
        toast.error("Erro ao gerar pergunta", {
          id: "generate-question",
        });
      });
  }

  return (
    <>
      {isLoading ? (
        <div className="w-full my-6 flex items-center justify-center gap-x-3 animate-pulse text-lg">
          <Sparkles className="size-10 text-primary" /> <p>Gerando...</p>
        </div>
      ) : (
        <Form {...form}>
          <form
            className="space-y-6 overflow-y-auto px-4 pb-6"
            onSubmit={form.handleSubmit(handleCreateTopic)}
          >
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-semibold">
                    <Lightbulb className="size-4 text-primary" />
                    Pergunta sobre tema (tópico)
                    <Tooltip
                      trigger={
                        <HelpCircle className="size-5 hover:text-foreground duration-200 ease-in transition-colors" />
                      }
                      content={
                        <p>
                          Digite o tópico que você quer estudar. Pode ser
                          qualquer assunto ou matéria, de 2 a 300 caracteres.
                          Quanto mais específico, mais precisa será a pergunta
                          gerada pela IA.
                        </p>
                      }
                    />
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Estudos gerais"
                      {...field}
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
              name="difficulty"
              render={({ field }) => (
                <FormItem className="bg-slate-50 dark:bg-transparent backdrop-blur-xl rounded-4xl p-6 border border-white/10 flex flex-col gap-y-6">
                  <FormLabel className="text-lg font-bold flex items-center gap-2">
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

            <div className="w-full flex items-center justify-end">
              <Button
                disabled={isLoading}
                variant={"outline"}
                size={"lg"}
                className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              >
                <p className="flex items-center gap-x-3">
                  <Sparkles className="animate-pulse" /> Gerar perguntar
                </p>
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
