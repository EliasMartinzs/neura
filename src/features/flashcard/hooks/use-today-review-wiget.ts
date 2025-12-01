import { useMemo, useCallback } from "react";
import { $Enums } from "@prisma/client";

type Flashcard = {
  id: string;
  difficulty: $Enums.FlashcardDifficulty | null;
  front: string;
  topic: string | null;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview: string | null;
  performanceAvg: number | null;
};

export const useTodayReviewWidget = (flashcards: Flashcard[]) => {
  const now = new Date();

  const overdueToday = useMemo(() => {
    return flashcards.filter(
      (card) => card.nextReview && new Date(card.nextReview) < now
    );
  }, [flashcards, now]);

  const upcomingToday = useMemo(() => {
    return flashcards.filter(
      (card) => card.nextReview && new Date(card.nextReview) >= now
    );
  }, [flashcards, now]);

  const formatTime = useCallback((date: Date | string) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getTimeStatus = useCallback(
    (date: Date | string) => {
      const target = new Date(date).getTime();
      const diff = target - now.getTime();
      const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
      const minutes = Math.floor(
        (Math.abs(diff) % (1000 * 60 * 60)) / (1000 * 60)
      );

      if (diff < 0) {
        if (hours > 0) return `${hours}h atrás`;
        return `${minutes}m atrás`;
      } else {
        if (hours > 0) return `em ${hours}h`;
        return `em ${minutes}m`;
      }
    },
    [now]
  );

  const difficultyConfig = useMemo(
    () => ({
      VERY_EASY: {
        dot: "bg-cyan-500/10",
        badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      },
      EASY: {
        dot: "bg-emerald-500/10",
        badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      },
      MEDIUM: {
        dot: "bg-amber-500/10",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      },
      HARD: {
        dot: "bg-rose-500/10",
        badge: "bg-rose-500/20 text-rose-400 border-rose-500/30",
      },
      VERY_HARD: {
        dot: "bg-purple-500/10",
        badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      },
    }),
    []
  );

  return {
    now,
    overdueToday,
    upcomingToday,
    formatTime,
    getTimeStatus,
    difficultyConfig,
  };
};
