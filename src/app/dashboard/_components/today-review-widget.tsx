import { useTodayReviewWidget } from "@/features/flashcard/hooks/use-today-review-wiget";
import { $Enums } from "@prisma/client";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";

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

type Props = {
  flashcards: Flashcard[];
};

function TodayReviewsWidgetComponent({ flashcards }: Props) {
  const router = useRouter();

  const {
    difficultyConfig,
    formatTime,
    getTimeStatus,
    overdueToday,
    upcomingToday,
    now,
  } = useTodayReviewWidget(flashcards);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-2xl shadow-2xl">
        {/* Efeitos de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-linear-to-tr from-red-500/10 to-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Header */}
        <div
          className="relative p-5 pb-4 border-b border-slate-700/50 cursor-pointer"
          onClick={() => router.push("/dashboard/review")}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-br from-orange-500 to-red-500 rounded-xl blur-lg opacity-50 animate-pulse" />
                <div className="relative bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-xl p-2.5 border border-orange-500/30 backdrop-blur-sm">
                  <Flame className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <p className="font-medium text-lg">Hoje</p>
            </div>

            {/* Badge de total */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-orange-500/30 to-red-500/30 rounded-2xl blur-md" />
              <div className="relative bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm rounded-2xl px-4 py-2">
                <div className="text-orange-400 text-xs font-medium">Cards</div>
                <div className="text-white text-3xl font-extrabold">
                  {flashcards.length}
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {flashcards.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  Progresso do dia
                </span>
                <span className="text-slate-300 font-bold">
                  {overdueToday.length > 0
                    ? `${overdueToday.length} pendentes`
                    : "Em dia!"}
                </span>
              </div>
              <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-orange-500 to-red-500 rounded-full transition-all duration-1000" />
              </div>
            </div>
          )}
        </div>

        {/* Cards List */}
        <div className="relative p-5">
          {flashcards.length > 0 ? (
            <div
              className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50"
              onClick={() => router.push(`/dashboard/review`)}
            >
              {flashcards.map((card, index) => {
                const diffStyle =
                  difficultyConfig[
                    card.difficulty as $Enums.FlashcardDifficulty
                  ];
                const isOverdue = new Date(card.nextReview!) < now;

                return (
                  <div
                    key={card.id}
                    className="group cursor-pointer"
                    style={{
                      animation: `slideIn 0.4s ease-out ${index * 0.06}s both`,
                    }}
                  >
                    <div
                      className={`relative rounded-xl bg-slate-800/50 border backdrop-blur-sm p-3.5 transition-all duration-300 hover:bg-slate-800/70 ${
                        isOverdue
                          ? "border-red-500/40 hover:border-red-500/60"
                          : "border-slate-700/50 hover:border-slate-600"
                      }`}
                    >
                      {/* Status indicator */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                          isOverdue
                            ? "bg-linear-to-b from-red-500 to-orange-500"
                            : "bg-linear-to-b from-orange-500 to-yellow-500"
                        }`}
                      />

                      {/* Glow on hover */}
                      <div className="absolute inset-0 rounded-xl bg-linear-to-r from-orange-500/0 via-orange-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="relative space-y-2.5">
                        {/* Header */}
                        <div className="flex items-start gap-2.5">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                              {card.front}
                            </h4>
                            {card.topic && (
                              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <Target className="w-3 h-3 shrink-0" />
                                <span className="truncate">{card.topic}</span>
                              </div>
                            )}
                          </div>

                          {/* Difficulty badge */}
                          {card.difficulty && (
                            <div
                              className={`${diffStyle.badge} border px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap shrink-0`}
                            >
                              {card.difficulty[0].toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Time info */}
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-1.5 text-xs font-semibold ${
                              isOverdue ? "text-red-400" : "text-orange-400"
                            }`}
                          >
                            {isOverdue ? (
                              <AlertCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            <span>
                              {getTimeStatus(new Date(card.nextReview!))}
                            </span>
                          </div>
                          <div className="text-slate-500 text-xs">
                            {formatTime(new Date(card.nextReview!))}
                          </div>
                        </div>

                        {/* Stats footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                          <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1 text-slate-500">
                              <Brain className="w-3 h-3" />
                              <span>{card.repetition}x</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-500">
                              <TrendingUp className="w-3 h-3" />
                              <span>{card.interval}d</span>
                            </div>
                          </div>

                          {card.performanceAvg !== null && (
                            <div
                              className={`text-xs font-bold ${
                                card.performanceAvg >= 70
                                  ? "text-emerald-400"
                                  : card.performanceAvg >= 50
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {card.performanceAvg.toFixed(0)}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">
                Tudo em dia!
              </h4>
              <p className="text-slate-400 text-sm mb-1">
                Nenhuma revisão agendada para hoje
              </p>
              <p className="text-slate-500 text-xs">
                Aproveite para criar novos cards 🎉
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {flashcards.length > 0 && (
          <div className="relative p-5 pt-3 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                <span>Continue seu ritmo!</span>
              </div>
              <div className="flex items-center gap-3">
                {overdueToday.length > 0 && (
                  <div className="flex items-center gap-1.5 text-red-400 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{overdueToday.length} atrasadas</span>
                  </div>
                )}
                {upcomingToday.length > 0 && (
                  <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{upcomingToday.length} futuras</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const TodayReviewWidget = memo(TodayReviewsWidgetComponent);
TodayReviewWidget.displayName = "TodayReviewWidget";
