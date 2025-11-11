import { ResponseFlashcard } from "@/features/flashcard/api/use-get-flashcard";
import { BloomLevel, FlashcardDifficulty } from "@prisma/client";

type DifficultyInfo = {
  bg: string;
  text: string;
  border: string;
  label: string;
  icon: string;
  description: string;
};

type BloomInfo = {
  label: string;
  icon: string;
  description: string;
};

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export const useHelperFlashcard = (flashcard: Flashcard) => {
  const difficultyConfig: Record<FlashcardDifficulty, DifficultyInfo> = {
    VERY_EASY: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-950 dark:text-cyan-400",
      border: "border-cyan-500",
      label: "Muito Fácil",
      icon: "🔵",
      description: "Conceitos triviais e básicos",
    },
    EASY: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-950 dark:text-emerald-400",
      border: "border-emerald-500",
      label: "Fácil",
      icon: "🟢",
      description: "Conceitos básicos e fundamentais",
    },
    MEDIUM: {
      bg: "bg-amber-500/10",
      text: "text-amber-950 dark:text-amber-400",
      border: "border-amber-500",
      label: "Médio",
      icon: "🟡",
      description: "Requer compreensão intermediária",
    },
    HARD: {
      bg: "bg-rose-500/10",
      text: "text-rose-950 dark:text-rose-400",
      border: "border-rose-500",
      label: "Difícil",
      icon: "🔴",
      description: "Conceitos avançados e complexos",
    },
    VERY_HARD: {
      bg: "bg-purple-500/10",
      text: "text-purple-950 dark:text-purple-400",
      border: "border-purple-500",
      label: "Muito Difícil",
      icon: "🟣",
      description: "Conceitos extremamente complexos",
    },
  };

  const bloomLevelConfig: Record<BloomLevel, BloomInfo> = {
    REMEMBER: {
      label: "Lembrar",
      icon: "🧠",
      description: "Recordar informações",
    },
    UNDERSTAND: {
      label: "Entender",
      icon: "💡",
      description: "Compreender o significado",
    },
    APPLY: {
      label: "Aplicar",
      icon: "🔧",
      description: "Usar em novas situações",
    },
    ANALYZE: {
      label: "Analisar",
      icon: "🔍",
      description: "Examinar componentes",
    },
    EVALUATE: {
      label: "Avaliar",
      icon: "⚖️",
      description: "Fazer julgamentos",
    },
    CREATE: { label: "Criar", icon: "✨", description: "Produzir algo novo" },
  };

  const formatDate = (input?: string | Date | null) => {
    if (!input) return { text: "Nunca revisado", relative: "" };

    const date = new Date(input);
    const diffDays = Math.floor((date.getTime() - Date.now()) / 86400000);

    const relative =
      diffDays === 0
        ? "Hoje"
        : diffDays === 1
        ? "Amanhã"
        : diffDays === -1
        ? "Ontem"
        : diffDays > 0
        ? `Em ${diffDays} dias`
        : `${Math.abs(diffDays)} dias atrás`;

    return {
      text: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      relative,
    };
  };

  const getEaseFactorInfo = (factor: number) => {
    if (factor >= 2.5)
      return { label: "Excelente", color: "text-emerald-600", icon: "🌟" };
    if (factor >= 2.0)
      return { label: "Bom", color: "text-blue-600", icon: "👍" };
    if (factor >= 1.5)
      return { label: "Regular", color: "text-amber-600", icon: "📚" };
    return { label: "Precisa Revisar", color: "text-rose-600", icon: "⚠️" };
  };

  const getPerformanceInfo = (avg: number) => {
    if (avg >= 80)
      return {
        label: "Excelente",
        color: "text-emerald-600",
        bg: "bg-emerald-500",
      };
    if (avg >= 60)
      return { label: "Bom", color: "text-blue-600", bg: "bg-blue-500" };
    if (avg >= 40)
      return { label: "Regular", color: "text-amber-600", bg: "bg-amber-500" };
    return {
      label: "Precisa Melhorar",
      color: "text-rose-600",
      bg: "bg-rose-500",
    };
  };

  const computed = flashcard && {
    difficulty: difficultyConfig[flashcard.difficulty!],
    bloomLevel: bloomLevelConfig[flashcard.bloomLevel!],
    easeInfo: getEaseFactorInfo(flashcard.easeFactor),
    performanceInfo: getPerformanceInfo(flashcard.performanceAvg ?? 0),
    nextReviewDate: formatDate(flashcard.nextReview),
    lastReviewDate: formatDate(flashcard.lastReviewedAt),
  };

  return {
    difficultyConfig,
    bloomLevelConfig,
    formatDate,
    getEaseFactorInfo,
    getPerformanceInfo,
    ...computed,
  };
};
