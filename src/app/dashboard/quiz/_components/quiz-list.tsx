import { ResponseGetQuiz } from "@/features/quiz/api/use-get-quizs";
import { useQuizBadges } from "@/features/quiz/hooks/use-quiz-badge";
import { $Enums } from "@prisma/client";
import { Brain } from "lucide-react";
import { memo, useMemo } from "react";
import { QuizItem } from "./quiz-item";
import { QUIZ } from "@/constants/quiz";

type Quiz = ResponseGetQuiz["data"];

type QuizSteps = NonNullable<
  NonNullable<ResponseGetQuiz["data"]>[number]
>["steps"][number];

type Props = {
  filteredQuizzes: Quiz;
  calculateAccuracy: (steps: QuizSteps[]) => number;
  calculateScore: (steps: QuizSteps[]) => { correct: number; total: number };
  totalCompleted: number;
};

const QuizListComponent = ({
  filteredQuizzes,
  calculateAccuracy,
  calculateScore,
  totalCompleted,
}: Props) => {
  const { getDifficultyBadge } = useQuizBadges();

  const processedQuizzes = useMemo(() => {
    return filteredQuizzes?.map((quiz) => {
      const score = calculateScore(quiz.steps);
      const accuracy = calculateAccuracy(quiz.steps);
      return { quiz, score, accuracy };
    });
  }, [filteredQuizzes, calculateAccuracy, calculateScore]);

  const difficultySummary = useMemo(() => {
    const map = {
      EASY: 0,
      MEDIUM: 0,
      HARD: 0,
    };

    filteredQuizzes?.forEach((q) => {
      if (q.status === "COMPLETED") {
        map[q.difficulty]++;
      }
    });

    return map;
  }, [filteredQuizzes]);

  if (!filteredQuizzes?.length) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground">
          Nenhum quiz encontrado nesta categoria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LISTA */}
      <div className="lg:col-span-2 space-y-4">
        {processedQuizzes?.map(({ quiz, score, accuracy }) => (
          <QuizItem
            key={quiz.id}
            quiz={quiz}
            score={score}
            accuracy={accuracy}
            getDifficultyBadge={getDifficultyBadge}
          />
        ))}
      </div>

      {/* SIDEBAR */}
      <div className="space-y-4 text-white">
        <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-6 backdrop-blur-sm sticky top-32">
          <h3 className="text-lg font-bold mb-4">Visão Geral</h3>

          <div className="space-y-4">
            {/* TAXA DE CONCLUSÃO */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Taxa de Conclusão</span>
                <span className="text-sm font-bold text-emerald-400">
                  {Math.round((totalCompleted / filteredQuizzes.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-emerald-600"
                  style={{
                    width: `${
                      (totalCompleted / filteredQuizzes.length) * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* DIFICULDADE */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Por Dificuldade</h4>

              {Object.entries(difficultySummary).map(([key, count]) => (
                <div
                  key={key}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="text-xs">
                    {QUIZ.QuizDifficulty[key as $Enums.QuizDifficulty]}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      getDifficultyBadge(key as $Enums.QuizDifficulty).split(
                        " "
                      )[1]
                    }`}
                  >
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuizList = memo(QuizListComponent);
QuizList.displayName = "QuizList";
