import { ResponseUseGetReviews } from "@/features/study/api/use-get-reviews";
import {
  AlertCircle,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  LucideIcon,
  Target,
  TrendingUp,
} from "lucide-react";
import { memo } from "react";

type Card = NonNullable<
  NonNullable<ResponseUseGetReviews>["data"]
>["today"][number];

type Column = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  count: number;
  cards: any;
  gradient: string;
  bgGradient: string;
  glowColor: string;
  iconColor: string;
  countBg: string;
  countBorder: string;
  countText: string;
};

type Props = {
  card: Card;
  column: Column;
  index: number;
  formatDate: (d: string) => string;
  formatTime: (d: string) => string;
  getDaysUntil: (d: string) => number;
};

const ReviewCardComponent = ({
  card,
  column,
  formatDate,
  formatTime,
  getDaysUntil,
  index,
}: Props) => {
  const performance = card.performanceAvg || 0;

  return (
    <div
      key={card.id}
      className="group"
      style={{ animation: `cardSlideIn 0.4s ease-out ${index * 0.05}s both` }}
    >
      <div
        className={`relative rounded-4xl border-t-8 dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 backdrop-blur-xl p-4 transition-all duration-300 cursor-pointer`}
        style={{
          borderTopColor: column.countBorder,
        }}
      >
        {/* Borda superior colorida */}

        <div className="space-y-3">
          {/* Header do card */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                {card.front}
              </h4>
              {card.topic && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Target className="w-3 h-3" />
                  <span className="truncate">{card.topic}</span>
                </div>
              )}
            </div>

            {/* Badge de dificuldade */}
            {card.difficulty && (
              <div
                className={`px-2 py-1 rounded-lg text-xs font-bold ${
                  card.difficulty === "EASY"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : card.difficulty === "MEDIUM"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {card.difficulty === "EASY"
                  ? "F"
                  : card.difficulty === "MEDIUM"
                  ? "M"
                  : "D"}
              </div>
            )}
          </div>

          {/* Informações específicas por coluna */}
          <div className="space-y-2">
            {column.id === "urgent" && card.nextReview && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span className="font-semibold">
                    {Math.abs(getDaysUntil(card.nextReview))}d atrasado
                  </span>
                </div>
                <div className="text-slate-500">
                  {formatTime(card.nextReview)}
                </div>
              </div>
            )}

            {column.id === "today" && card.nextReview && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-orange-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-semibold">Hoje</span>
                </div>
                <div className="text-slate-400">
                  {formatTime(card.nextReview)}
                </div>
              </div>
            )}

            {column.id === "upcoming" && card.nextReview && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-blue-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-semibold">
                    {formatDate(card.nextReview)}
                  </span>
                </div>
                <div className="text-slate-500">
                  {getDaysUntil(card.nextReview)}d
                </div>
              </div>
            )}

            {column.id === "completed" && card.lastReviewedAt && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="font-semibold">
                    {formatDate(card.lastReviewedAt)}
                  </span>
                </div>
                <div
                  className={`font-bold ${
                    performance >= 70
                      ? "text-emerald-400"
                      : performance >= 50
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {performance.toFixed(0)}%
                </div>
              </div>
            )}

            {/* Footer com stats */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3" />
                  <span>{card.repetition}x</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{card.interval}d</span>
                </div>
              </div>
              <div className={`text-xs font-semibold ${column.iconColor}`}>
                EF: {card.easeFactor.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReviewCard = memo(ReviewCardComponent);
