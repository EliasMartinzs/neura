import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { ResponseGetQuiz } from "@/features/quiz/api/use-get-quiz";
import { useStepAnswer } from "@/features/quiz/api/use-step-answer";
import { useStepQuestion } from "@/features/quiz/api/use-step-question";
import { useUpdateToAbandoned } from "@/features/quiz/api/use-update-to-abandoned";
import { useBlockNavigation } from "@/hooks/use-block-navigation";
import { $Enums } from "@prisma/client";
import {
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Lightbulb,
  Loader2,
  Rocket,
  Scale,
  Sparkles,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

type Question = {
  options: {
    text: string;
    id: string;
    isCorrect: boolean;
    questionId: string;
  }[];
  explanation: {
    text: string;
    id: string;
    createdAt: string;
    type: $Enums.ExplanationType;
    questionId: string;
  } | null;
  id: string;
  content: string;
  stepId: string;
};

type AnswerType = {
  isCorrect: boolean | undefined;
  explanation:
    | {
        text: string;
        id: string;
        createdAt: string;
        type: $Enums.ExplanationType;
        questionId: string;
      }
    | null
    | undefined;
};

type Props = {
  data: ResponseGetQuiz["data"];
};

export const QuizSession = ({ data }: Props) => {
  const [session, setSession] = useState(data);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(data?.steps[0]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerType | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // prepara payload
      const payload = JSON.stringify({
        sessionId: session?.id,
      });

      // cria blob
      const blob = new Blob([payload], { type: "application/json" });

      // envia sem bloquear
      navigator.sendBeacon("/api/quiz/abandon", blob);

      // mostra alerta nativo
      e.preventDefault();
      (e as any).returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [session?.id]);

  const { confirmLeave, cancelLeave, shouldConfirm } = useBlockNavigation(true);

  const { mutate: mutateQuestion, isPending: questionPending } =
    useStepQuestion();
  const { mutate: mutateAnswer, isPending: answerPending } = useStepAnswer(
    currentStep?.id!
  );
  const { mutate: mutateAbandoned } = useUpdateToAbandoned();

  const isLoading = questionPending || answerPending;

  const stepConfig = {
    CONCEPT: {
      title: "Conceito",
      subtitle: "Compreenda os fundamentos",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600",
      glow: "shadow-purple-500/20",
      description:
        "Nesta etapa, você vai testar seu conhecimento sobre os conceitos básicos e fundamentais.",
    },
    EXAMPLE: {
      title: "Exemplo",
      subtitle: "Veja na prática",
      icon: Lightbulb,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/20",
      description:
        "Agora vamos aplicar o conceito em exemplos concretos do universo de One Piece.",
    },
    COMPARISON: {
      title: "Comparação",
      subtitle: "Analise as diferenças",
      icon: Scale,
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/20",
      description:
        "Compare elementos similares e identifique suas características únicas.",
    },
    APPLICATION: {
      title: "Aplicação",
      subtitle: "Domine o conhecimento",
      icon: Rocket,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/20",
      description: "Teste seu domínio completo aplicando tudo que aprendeu!",
    },
  };

  const config = stepConfig[currentStep?.stepType as $Enums.QuizStepType];

  const handleGenerateQuestion = () => {
    if (currentStep?.id) {
      mutateQuestion(
        {
          stepId: currentStep?.id,
        },
        {
          onSuccess: ({ data }) => {
            if (data?.question) {
              setQuestion(data.question);
            }
          },
        }
      );
    }
  };

  const handleSubmitAnswer = () => {
    const selectedOption = question?.options.find(
      (opt) => opt.id === selectedOptionId
    );
    if (selectedOption) {
      mutateAnswer(
        {
          optionId: selectedOption?.id,
        },
        {
          onSuccess: ({ data }) => {
            if (data) {
              setAnswerResult({
                isCorrect: selectedOption?.isCorrect,
                explanation: question?.explanation,
              });
              setShowExplanation(true);
            }
          },
        }
      );
    }
  };

  // Avançar para próximo step
  const handleNextStep = () => {
    if (currentStepIndex < Number(session?.steps.length) - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setCurrentStep(session?.steps[nextIndex]);
      setQuestion(null);
      setSelectedOptionId(null);
      setAnswerResult(null);
      setShowExplanation(false);
    } else {
      // Finalizar quiz - redirecionar para /result
    }
  };

  const handleAbandoned = () => {
    mutateAbandoned({
      sessionId: session?.id as string,
    });
  };

  const getDifficultyConfig = (difficulty: $Enums.QuizDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return { text: "Fácil", color: "from-emerald-500/30 to-teal-500/30" };
      case "MEDIUM":
        return { text: "Médio", color: "from-amber-500/30 to-orange-500/30" };
      case "HARD":
        return { text: "Difícil", color: "from-rose-500/30 to-pink-500/30" };
      default:
        return { text: "Normal", color: "from-gray-500/30 to-slate-500/30" };
    }
  };

  const difficultyConfig = getDifficultyConfig(
    session?.difficulty as $Enums.QuizDifficulty
  );

  return (
    <div className="">
      {shouldConfirm && (
        <AlertDialog open={shouldConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Tem certeza que deseja abandonar o quiz?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Se continuar, sua sessão será marcada como abandonada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className={buttonVariants({
                  variant: "ghost",
                  className: "flex-1",
                  size: "lg",
                })}
                onClick={cancelLeave}
              >
                Continuar no Quiz
              </AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({
                  variant: "ghost",
                  className: "flex-1",
                  size: "lg",
                })}
                onClick={() => {
                  confirmLeave();
                  handleAbandoned();
                }}
              >
                Abandonar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-slate-900 via-slate-800 to-slate-950 dark:from-slate-500 dark:via-slate-400 dark:to-slate-300 mb-2">
                {session?.topic}
              </h1>
            </div>
            <div
              className={`p-2 rounded-2xl bg-linear-to-r ${difficultyConfig.color} shadow-xl`}
            >
              <span className="font-medium text-white">
                {difficultyConfig.text}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              {session?.steps.map((step, index) => {
                const stepConf =
                  stepConfig[step.stepType as $Enums.QuizStepType];
                const StepIcon = stepConf.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                        isActive
                          ? `bg-linear-to-br ${stepConf.gradient} shadow-2xl ${stepConf.glow} scale-110`
                          : isCompleted
                          ? "bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg"
                          : "bg-slate-700/50 border-2 border-slate-600"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-7 h-7 text-white" />
                      ) : (
                        <StepIcon
                          className={`w-7 h-7 ${
                            isActive ? "text-white" : "text-slate-400"
                          }`}
                        />
                      )}
                    </div>
                    {index < session.steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full ${
                          isCompleted
                            ? "bg-linear-to-r from-emerald-500 to-teal-500"
                            : "bg-slate-700/50"
                        }`}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-sm font-bold">
              {session?.steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex-1 text-center ${
                    index === currentStepIndex
                      ? "text-purple-300"
                      : "text-slate-500"
                  }`}
                >
                  {stepConfig[step.stepType as $Enums.QuizStepType].title}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="relative group">
          <div
            className={`absolute inset-0 bg-linear-to-r rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity`}
          ></div>

          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
            {/* Step Header */}
            <div className={`p-8 bg-linear-to-r ${config.gradient}`}>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-4 bg-white/20 backdrop-blur-xl rounded-2xl">
                  <config.icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white">
                    {config.title}
                  </h2>
                  <p className="text-white/90 text-lg font-medium">
                    {config.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-white/80 font-medium">{config.description}</p>
            </div>

            {/* Content Area */}
            <div className="p-8">
              {!question && !isLoading && (
                <div className="text-center py-16">
                  <div className="inline-flex p-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl mb-6">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Pronto para o desafio?
                  </h3>
                  <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                    Clique no botão abaixo para gerar uma pergunta personalizada
                    sobre {session?.topic}
                  </p>
                  <button
                    onClick={handleGenerateQuestion}
                    className="group/btn relative px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl font-black text-white text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <Zap className="w-6 h-6" />
                      Gerar Pergunta
                      <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-16">
                  <div className="inline-flex p-6 bg-linear-to-br from-indigo-500 to-purple-500 rounded-3xl shadow-2xl mb-6 animate-pulse">
                    <Brain className="w-16 h-16 text-white animate-bounce" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Gerando sua pergunta...
                  </h3>
                  <p className="text-slate-400 text-lg mb-6">
                    A IA está criando uma pergunta épica para você!
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                    <span className="text-purple-400 font-bold">
                      Aguarde...
                    </span>
                  </div>
                </div>
              )}

              {question && !answerResult && (
                <div className="space-y-6">
                  {/* Question */}
                  <div className="relative group/item">
                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
                    <div className="relative bg-slate-700/50 rounded-2xl p-6 border border-slate-600">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="p-2 bg-linear-to-br from-indigo-500 to-purple-500 rounded-lg shrink-0">
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Pergunta
                        </h3>
                      </div>
                      <p className="text-slate-200 text-lg leading-relaxed">
                        {question.content}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedOptionId(option.id)}
                        disabled={isValidating}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all group/option ${
                          selectedOptionId === option.id
                            ? "bg-linear-to-r from-purple-500 to-pink-500 border-purple-400 shadow-2xl shadow-purple-500/50 scale-105"
                            : "bg-slate-700/30 border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
                        } ${
                          isValidating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex items-center justify-center w-10 h-10 rounded-xl font-black text-lg transition-all ${
                              selectedOptionId === option.id
                                ? "bg-white text-purple-600"
                                : "bg-slate-600 text-slate-300 group-hover/option:bg-slate-500"
                            }`}
                          >
                            {String.fromCharCode(65 + index)}
                          </div>
                          <span
                            className={`font-semibold text-lg ${
                              selectedOptionId === option.id
                                ? "text-white"
                                : "text-slate-300"
                            }`}
                          >
                            {option.text}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedOptionId || isValidating}
                    className={`w-full py-5 rounded-2xl font-black text-xl transition-all ${
                      !selectedOptionId || isValidating
                        ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                        : "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-2xl shadow-emerald-500/50 hover:scale-105"
                    }`}
                  >
                    {isValidating ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Validando resposta...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Target className="w-6 h-6" />
                        Confirmar Resposta
                      </span>
                    )}
                  </button>
                </div>
              )}

              {answerResult && showExplanation && (
                <div className="space-y-6">
                  {/* Result Banner */}
                  <div
                    className={`relative group/item p-8 rounded-3xl text-center ${
                      answerResult.isCorrect
                        ? "bg-linear-to-r from-emerald-500 to-teal-500"
                        : "bg-linear-to-r from-rose-500 to-pink-500"
                    }`}
                  >
                    <div className="inline-flex p-6 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl mb-4">
                      {answerResult.isCorrect ? (
                        <Trophy className="w-20 h-20 text-white" />
                      ) : (
                        <X className="w-20 h-20 text-white" />
                      )}
                    </div>
                    <h3 className="text-5xl font-black text-white mb-2">
                      {answerResult.isCorrect ? "Parabéns!" : "Quase lá!"}
                    </h3>
                    <p className="text-white/90 text-xl font-bold">
                      {answerResult.isCorrect
                        ? "Você acertou a questão!"
                        : "Não foi dessa vez, mas você está aprendendo!"}
                    </p>
                  </div>

                  {/* Explanation */}
                  {answerResult.explanation && (
                    <div className="relative group/item">
                      <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
                      <div className="relative bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/30">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-3 bg-linear-to-br from-cyan-500 to-blue-500 rounded-xl shrink-0">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-cyan-300 mb-2">
                              Explicação
                            </h4>
                          </div>
                        </div>
                        <p className="text-slate-200 text-lg leading-relaxed">
                          {answerResult.explanation.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Next Button */}
                  <button
                    onClick={handleNextStep}
                    className="w-full py-5 rounded-2xl font-black text-xl bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-2xl shadow-purple-500/50 hover:scale-105 transition-all"
                  >
                    <span className="flex items-center justify-center gap-3">
                      {currentStepIndex < Number(session?.steps.length) - 1
                        ? "Próximo Step"
                        : "Ver Resultados"}
                      <ChevronRight className="w-6 h-6" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step Info Cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {session?.steps.map((step, index) => {
            const stepConf = stepConfig[step.stepType as $Enums.QuizStepType];
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <div
                key={step.id}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  isActive
                    ? `bg-linear-to-br ${stepConf.gradient} border-transparent shadow-2xl ${stepConf.glow}`
                    : isCompleted
                    ? "bg-slate-800/80 border-emerald-500/50"
                    : "bg-slate-800/50 border-slate-700"
                }`}
              >
                <div className="text-center">
                  <div
                    className={`inline-flex p-2 rounded-xl mb-2 ${
                      isActive
                        ? "bg-white/20"
                        : isCompleted
                        ? "bg-emerald-500/20"
                        : "bg-slate-700"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <stepConf.icon
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-slate-400"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`font-bold text-sm ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }`}
                  >
                    {stepConf.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
