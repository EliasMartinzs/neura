import { ResponseGetQuiz } from "@/features/quiz/api/use-get-quiz";
import { $Enums } from "@prisma/client";
import {
  Award,
  Brain,
  Check,
  Crown,
  Lightbulb,
  Rocket,
  Scale,
  Sparkles,
  Star,
  Target,
  Trophy,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

type Props = {
  session: ResponseGetQuiz["data"];
};

export const QuizResults = ({ session }: Props) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const stepConfig = {
    CONCEPT: {
      title: "Conceito",
      icon: Brain,
      gradient: "from-purple-500 to-indigo-600",
      glow: "shadow-purple-500/50",
    },
    EXAMPLE: {
      title: "Exemplo",
      icon: Lightbulb,
      gradient: "from-amber-500 to-orange-600",
      glow: "shadow-amber-500/50",
    },
    COMPARISON: {
      title: "Comparação",
      icon: Scale,
      gradient: "from-cyan-500 to-blue-600",
      glow: "shadow-cyan-500/50",
    },
    APPLICATION: {
      title: "Aplicação",
      icon: Rocket,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-500/50",
    },
  };

  // Calcular estatísticas
  const totalQuestions = Number(session?.steps.length);
  const correctAnswers = Number(
    session?.steps.filter((s) => s.isCorrect).length
  );
  const wrongAnswers = totalQuestions - correctAnswers;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Determinar performance level
  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90)
      return {
        title: "LENDÁRIO!",
        subtitle: "Desempenho Épico",
        icon: Crown,
        gradient: "from-yellow-400 via-amber-500 to-orange-500",
        glow: "shadow-amber-500/50",
        message:
          "Você dominou completamente este tema! Conhecimento digno de um Yonkou! 👑",
      };
    if (percentage >= 75)
      return {
        title: "EXCELENTE!",
        subtitle: "Ótimo Desempenho",
        icon: Trophy,
        gradient: "from-emerald-400 via-teal-500 to-cyan-500",
        glow: "shadow-emerald-500/50",
        message: "Parabéns! Você demonstrou grande domínio sobre o assunto! 🏆",
      };
    if (percentage >= 50)
      return {
        title: "BOM TRABALHO!",
        subtitle: "Bom Desempenho",
        icon: Star,
        gradient: "from-blue-400 via-indigo-500 to-purple-500",
        glow: "shadow-blue-500/50",
        message:
          "Você está no caminho certo! Continue estudando para evoluir ainda mais! ⭐",
      };
    return {
      title: "CONTINUE TENTANDO!",
      subtitle: "Pode Melhorar",
      icon: Target,
      gradient: "from-rose-400 via-pink-500 to-purple-500",
      glow: "shadow-rose-500/50",
      message:
        "Não desanime! Todo pirata enfrentou dificuldades. Revise o conteúdo e tente novamente! 🎯",
    };
  };

  const performance = getPerformanceLevel(scorePercentage);
  const PerformanceIcon = performance.icon;

  const getDifficultyConfig = (difficulty: $Enums.QuizDifficulty) => {
    switch (difficulty) {
      case "EASY":
        return { text: "Fácil", color: "from-emerald-500 to-teal-500" };
      case "MEDIUM":
        return { text: "Médio", color: "from-amber-500 to-orange-500" };
      case "HARD":
        return { text: "Difícil", color: "from-rose-500 to-pink-500" };
      default:
        return { text: "Normal", color: "from-gray-500 to-slate-500" };
    }
  };

  const difficultyConfig = getDifficultyConfig(
    session?.difficulty as $Enums.QuizDifficulty
  );

  return (
    <div className="">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative group mb-8">
          <div
            className={`absolute inset-0 bg-linear-to-r ${performance.gradient} rounded-3xl blur-3xl opacity-40 animate-pulse`}
          ></div>

          <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-3xl overflow-hidden wrap-break-word">
            <div className={`p-12 bg-linear-to-r ${performance.gradient}`}>
              <div className="text-center">
                {/* Icon */}
                <div className="inline-flex p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 animate-bounce">
                  <PerformanceIcon className="w-24 h-24 text-white" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-3 drop-shadow-2xl">
                  {performance.title}
                </h1>
                <p className="text-xl font-bold text-white/90 mb-6">
                  {performance.subtitle}
                </p>

                {/* Score Circle */}
                <div className="inline-flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="white"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 88 * (1 - scorePercentage / 100)
                        }`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-black text-white">
                          {scorePercentage}%
                        </div>
                        <div className="text-sm font-bold text-white/80">
                          Acertos
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/90 text-lg font-medium max-w-2xl px-4">
                    {performance.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-4 p-6 bg-slate-900/50">
              <div className="flex-1 text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex justify-center mb-2">
                  <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {correctAnswers}
                </div>
                <div className="text-slate-400 font-semibold text-sm">
                  Acertos
                </div>
              </div>

              <div className="flex-1 text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex justify-center mb-2">
                  <X className="w-8 h-8 text-rose-400" />
                </div>
                <div className="text-3xl font-black text-white mb-1">
                  {wrongAnswers}
                </div>
                <div className="text-slate-400 font-semibold text-sm">
                  Erros
                </div>
              </div>

              <div className="flex-1 text-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                <div className="flex justify-center mb-2">
                  <Zap className="w-8 h-8 text-amber-400" />
                </div>
                <div
                  className={`text-lg font-black bg-linear-to-r ${difficultyConfig.color} bg-clip-text text-transparent mb-1`}
                >
                  {difficultyConfig.text}
                </div>
                <div className="text-slate-400 font-semibold text-sm">
                  Dificuldade
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topic Info */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-black mb-2">{session?.topic}</h2>
          {session?.subtopic && (
            <p className="text-xl text-purple-300 font-bold">
              {session?.subtopic}
            </p>
          )}
        </div>

        {/* Steps Review */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black">Revisão Detalhada</h3>
          </div>

          <div className="space-y-4">
            {session?.steps.map((step, index) => {
              const config = stepConfig[step.stepType as $Enums.QuizStepType];
              const StepIcon = config.icon;
              const isExpanded = expandedStep === step.id;

              return (
                <div key={step.id} className="relative group">
                  <div
                    className={`absolute inset-0 bg-linear-to-r ${
                      step.isCorrect
                        ? "from-emerald-500 to-teal-500"
                        : "from-rose-500 to-pink-500"
                    } rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}
                  ></div>

                  <div className="relative bg-slate-800/90 backdrop-blur-xl rounded-4xl border border-slate-700/50 overflow-hidden">
                    {/* Step Header */}
                    <div
                      onClick={() =>
                        setExpandedStep(isExpanded ? null : step.id)
                      }
                      className="p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Step Icon */}
                        <div
                          className={`p-3 bg-linear-to-br ${config.gradient} rounded-2xl shadow-lg ${config.glow}`}
                        >
                          <StepIcon className="size-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-slate-500 font-black text-lg">
                              #{index + 1}
                            </span>
                            <h4 className="text-md font-black text-white">
                              {config.title}
                            </h4>
                            <span
                              className={`px-2 py-1.5 rounded-full font-bold text-xs ${
                                step.isCorrect
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/50"
                              }`}
                            >
                              {step.isCorrect ? "Acertou" : "Errou"}
                            </span>
                          </div>
                          <p className="text-slate-300 line-clamp-1 text-sm">
                            {step?.question?.content}
                          </p>
                        </div>

                        {/* Result Icon */}
                        <div
                          className={`p-3 rounded-2xl ${
                            step.isCorrect
                              ? "bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50"
                              : "bg-linear-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/50"
                          }`}
                        >
                          {step.isCorrect ? (
                            <Check className="size-5 text-white" />
                          ) : (
                            <X className="size-5 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="border-t border-slate-700/50 bg-slate-900/50 p-6 space-y-4">
                        {/* Question */}
                        <div>
                          <h5 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Pergunta
                          </h5>
                          <p className="text-slate-300 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            {step?.question?.content}
                          </p>
                        </div>

                        {/* User Answer */}
                        <div>
                          <h5 className="font-bold text-white mb-2">
                            Sua Resposta
                          </h5>
                          <div
                            className={`p-4 rounded-xl border-2 ${
                              step.isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/50"
                                : "bg-rose-500/10 border-rose-500/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {step.isCorrect ? (
                                <Check className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <X className="w-5 h-5 text-rose-400" />
                              )}
                              <span
                                className={`font-semibold ${
                                  step.isCorrect
                                    ? "text-emerald-300"
                                    : "text-rose-300"
                                }`}
                              >
                                {step?.userAnswer?.text}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Correct Answer (if wrong) */}
                        {!step.isCorrect && (
                          <div>
                            <h5 className="font-bold text-white mb-2">
                              Resposta Correta
                            </h5>
                            <div className="p-4 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/50">
                              <div className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-emerald-400" />
                                <span className="font-semibold text-emerald-300">
                                  {step.question?.explanation?.text}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
