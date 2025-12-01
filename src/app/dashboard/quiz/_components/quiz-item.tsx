import { Button } from "@/components/ui/button";
import { ResponseGetQuiz } from "@/features/quiz/api/use-get-quizs";
import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import {
  Award,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo, useCallback, useState } from "react";
import { DeleteQuizButton } from "./delete-quiz-button";

type Quiz = NonNullable<ResponseGetQuiz["data"]>[number];

type Props = {
  quiz: Quiz;
  score: any;
  accuracy: number;
  getDifficultyBadge: (difficulty: $Enums.QuizDifficulty) => void;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export type QuarterProgress = 25 | 50 | 75 | 100;

export function getProgressColor(
  accuracy: number,
  completedAt: string | null
): string {
  if (!completedAt) return "#475569";

  if (accuracy === 0) return "#EF4444";

  if (accuracy <= 25) return "#EF4444";
  if (accuracy <= 50) return "#F59E0B";
  if (accuracy <= 75) return "#3B82F6";

  return "#22C55E";
}

const getStatusBadge = (status: $Enums.QuizStatus) => {
  const styles = {
    COMPLETED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    ACTIVE: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    ABANDONED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return styles[status];
};

const getStepIcon = (stepType: $Enums.QuizStepType) => {
  const icons = {
    CONCEPT: Brain,
    EXAMPLE: Target,
    COMPARISON: TrendingUp,
    APPLICATION: Award,
  };
  return icons[stepType];
};

const QuizItemComponent = ({
  quiz,
  accuracy,
  score,
  getDifficultyBadge,
}: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleResetQuiz = useCallback(
    ({ href, status }: { href: string; status: $Enums.QuizStatus }) => {
      if (status !== "ACTIVE") return;

      router.push(href);
    },
    []
  );

  return (
    <div className="group dark:bg-none bg-linear-to-br text-white from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-6 backdrop-blur-sm cursor-pointer transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold capitalize">{quiz.topic}</h3>

            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyBadge(
                quiz.difficulty
              )}`}
            >
              {quiz.difficulty}
            </span>

            <span
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusBadge(
                quiz.status
              )}`}
            >
              {quiz.status}
            </span>
          </div>

          {quiz.subtopic && <p className="text-sm">{quiz.subtopic}</p>}
        </div>

        <div className="flex items-center justify-between gap-x-3">
          <DeleteQuizButton id={quiz.id} />

          <Button
            variant={"icon"}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-black border hover:scale-none",
              quiz.status !== "ACTIVE" && "hidden"
            )}
            onClick={() =>
              handleResetQuiz({
                href: `/dashboard/quiz/${quiz.id}`,
                status: quiz.status,
              })
            }
          >
            Recomeçar o quiz
          </Button>
          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              open ? "rotate-90" : ""
            }`}
            onClick={toggle}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(quiz.createdAt)}</span>
        </div>

        {quiz.completedAt && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-400">Concluído</span>
          </div>
        )}
      </div>

      {/* Progress */}
      {quiz.steps.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>
              Progresso: {score.correct}/{score.total}
            </span>

            <span
              className={`font-bold ${
                accuracy >= 70
                  ? "text-emerald-400"
                  : accuracy >= 50
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {accuracy}%
            </span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r transition-all duration-500"
              style={{
                width: `${(score.total / quiz.steps.length) * 100}%`,
                backgroundColor: getProgressColor(accuracy, quiz.completedAt),
              }}
            />
          </div>
        </div>
      )}

      {/* Expanded steps */}
      {open && quiz.steps.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-800/50 space-y-4">
          {quiz.steps.map((step, idx) => {
            const StepIcon = getStepIcon(step.stepType);

            return (
              <div
                key={step.id}
                className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      step.isCorrect === true
                        ? "bg-emerald-500/20"
                        : step.isCorrect === false
                        ? "bg-red-500/20"
                        : "bg-slate-700/30"
                    }`}
                  >
                    {step.isCorrect === true ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : step.isCorrect === false ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <StepIcon className="w-4 h-4 text-violet-400" />
                      <span className="text-sm font-semibold text-violet-300">
                        {step.stepType}
                      </span>
                      <span className="text-xs">#{idx + 1}</span>
                    </div>

                    {step.question && (
                      <>
                        <p className="text-sm text-slate-300 mb-3">
                          {step.question.content}
                        </p>

                        {step.userAnswer && (
                          <div
                            className={`p-3 rounded-lg border ${
                              step.isCorrect
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : "bg-red-500/10 border-red-500/30"
                            }`}
                          >
                            <p className="text-xs mb-1">Sua resposta:</p>
                            <p
                              className={`text-sm ${
                                step.isCorrect
                                  ? "text-emerald-300"
                                  : "text-red-300"
                              }`}
                            >
                              {step.userAnswer.text}
                            </p>
                          </div>
                        )}

                        {step.question.explanation && (
                          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-xs text-blue-400 mb-1 font-semibold">
                              Explicação:
                            </p>
                            <p className="text-sm text-slate-300">
                              {step.question.explanation.text}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const QuizItem = memo(QuizItemComponent);
QuizItem.displayName = "QuizItem";
