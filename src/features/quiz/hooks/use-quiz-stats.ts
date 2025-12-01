import { useCallback, useMemo } from "react";
import { ResponseGetQuiz } from "../api/use-get-quizs";

type QuizSteps = NonNullable<
  NonNullable<ResponseGetQuiz["data"]>[number]
>["steps"][number];

type Quiz = NonNullable<ResponseGetQuiz["data"]>[number];

export function useQuizStats(quizzes: Quiz[], filter: string) {
  const calculateScore = useCallback((steps: QuizSteps[]) => {
    const answered = steps.filter((s) => s.isCorrect !== null);
    const correct = answered.filter((s) => s.isCorrect === true);
    return { correct: correct.length, total: answered.length };
  }, []);

  const calculateAccuracy = useCallback(
    (steps: QuizSteps[]) => {
      const score = calculateScore(steps);
      return score.total > 0
        ? Math.round((score.correct / score.total) * 100)
        : 0;
    },
    [calculateScore]
  );

  const stats = useMemo(() => {
    const totalCorrect = quizzes.reduce(
      (acc, q) => acc + calculateScore(q.steps).correct,
      0
    );

    const totalQuestions = quizzes.reduce(
      (acc, q) => acc + q.steps.filter((s) => s.isCorrect !== null).length,
      0
    );

    const avgAccuracy =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0;

    const totalCompleted = quizzes.filter(
      (q) => q.status === "COMPLETED"
    ).length;

    return {
      totalCorrect,
      totalQuestions,
      avgAccuracy,
      totalCompleted,
    };
  }, [quizzes, calculateScore]);

  return {
    calculateScore,
    calculateAccuracy,
    ...stats,
  };
}
