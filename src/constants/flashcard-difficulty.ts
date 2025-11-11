import {
  Feather,
  Smile,
  Scale,
  Flame,
  Skull,
  type LucideIcon,
} from "lucide-react";

export const FlashcardDifficulty: Record<
  "VERY_EASY" | "EASY" | "MEDIUM" | "HARD" | "VERY_HARD",
  { label: string; icon: LucideIcon }
> = {
  VERY_EASY: {
    label: "Muito fácil",
    icon: Feather,
  },
  EASY: {
    label: "Fácil",
    icon: Smile,
  },
  MEDIUM: {
    label: "Médio",
    icon: Scale,
  },
  HARD: {
    label: "Difícil",
    icon: Flame,
  },
  VERY_HARD: {
    label: "Muito difícil",
    icon: Skull,
  },
} as const;
