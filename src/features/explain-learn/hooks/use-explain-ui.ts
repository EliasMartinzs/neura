import { Flame, Sparkles, Star, Target, Trophy, Zap } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

const difficultyConfigs = {
  easy: {
    bg: "from-emerald-500 to-teal-500",
    text: "Fácil",
    glow: "shadow-emerald-500/50",
    icon: Sparkles,
  },
  medium: {
    bg: "from-amber-500 to-orange-500",
    text: "Médio",
    glow: "shadow-amber-500/50",
    icon: Flame,
  },
  hard: {
    bg: "from-rose-500 to-pink-500",
    text: "Difícil",
    glow: "shadow-rose-500/50",
    icon: Zap,
  },
} as const;

const scoreConfigs = [
  {
    min: 90,
    color: "from-emerald-400 to-teal-500",
    label: "Excelente!",
    icon: Trophy,
  },
  {
    min: 75,
    color: "from-blue-400 to-cyan-500",
    label: "Muito Bom!",
    icon: Star,
  },
  {
    min: 60,
    color: "from-amber-400 to-orange-500",
    label: "Bom!",
    icon: Sparkles,
  },
];

function _getDifficultyConfig(difficulty: "easy" | "medium" | "hard") {
  return difficultyConfigs[difficulty] ?? difficultyConfigs.easy;
}

function _getScoreConfig(score: number) {
  for (const cfg of scoreConfigs) {
    if (score >= cfg.min) return cfg;
  }
  return {
    color: "from-rose-400 to-pink-500",
    label: "Pode Melhorar",
    icon: Target,
  };
}

function _formatDate(dateString: any) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function useExplainUI() {
  const [showInput, setShowInput] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getDifficultyConfig = useCallback(_getDifficultyConfig, []);
  const getScoreConfig = useCallback(_getScoreConfig, []);
  const formatDate = useCallback(_formatDate, []);

  return useMemo(
    () => ({
      showInput,
      setShowInput,
      expandedId,
      setExpandedId,
      getDifficultyConfig,
      getScoreConfig,
      formatDate,
    }),
    [
      showInput,
      expandedId,
      setShowInput,
      setExpandedId,
      getDifficultyConfig,
      getScoreConfig,
      formatDate,
    ]
  );
}
