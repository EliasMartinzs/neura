// hooks/use-quiz-badges.ts
import { $Enums } from "@prisma/client";

export function useQuizBadges() {
  const getDifficultyBadge = (difficulty: $Enums.QuizDifficulty) => {
    const styles = {
      EASY: "bg-green-500/20 text-green-300 border-green-500/30",
      MEDIUM: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      HARD: "bg-red-500/20 text-red-300 border-red-500/30",
    };

    return styles[difficulty];
  };

  return { getDifficultyBadge };
}
