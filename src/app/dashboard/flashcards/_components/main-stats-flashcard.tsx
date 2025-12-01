import { $Enums } from "@prisma/client";
import { BarChart3, Brain, TrendingUp } from "lucide-react";
import { FlashcardDifficulty } from "@/constants/flashcard-difficulty";
import { memo } from "react";

const MainStatsFlashcardComponent = ({
  _count,
  difficulty,
  performanceAvg,
  repetition,
}: {
  _count: { reviews: number };
  repetition: number;
  difficulty: $Enums.FlashcardDifficulty | null;
  performanceAvg: number | null;
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
      <div className="grid grid-cols-2 gap-4">
        {/* Reviews Count */}
        <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
          <BarChart3 className="w-6 h-6 /90 mb-1" />
          <div className="text-2xl font-bold ">{_count.reviews}</div>
          <div className="/70 text-xs font-medium">Revisões</div>
        </div>

        {/* Accuracy or Repetition */}
        <div className="bg-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
          {0 !== null ? (
            <>
              <TrendingUp className="w-6 h-6 text-green-300 mb-1" />
              <div className="text-2xl font-bold ">{0}%</div>
              <div className="/70 text-xs font-medium">Acertos</div>
            </>
          ) : (
            <>
              <Brain className="w-6 h-6 text-purple-300 mb-1" />
              <div className="text-2xl font-bold ">{repetition || 0}</div>
              <div className="/70 text-xs font-medium">Repetições</div>
            </>
          )}
        </div>
      </div>

      {/* Difficulty indicator */}
      {difficulty && (
        <div className="flex items-center justify-center gap-3 mt-4 bg-white/10 rounded-lg p-3">
          <div className="flex gap-1">
            {["VERY_EASY", "EASY", "MEDIUM", "HARD", "VERY_HARD"].map(
              (level, index) => {
                const isActive =
                  ["VERY_EASY", "EASY", "MEDIUM", "HARD", "VERY_HARD"].indexOf(
                    difficulty
                  ) >= index;
                return (
                  <div
                    key={level}
                    className={`w-1.5 h-5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-linear-to-t from-yellow-400 to-yellow-200 shadow-lg"
                        : "bg-white/20"
                    }`}
                  ></div>
                );
              }
            )}
          </div>
          <span className=" text-sm font-semibold">
            {FlashcardDifficulty[difficulty].label || difficulty}
          </span>
        </div>
      )}

      {/* Performance Average */}
      {performanceAvg !== null && performanceAvg > 0 && (
        <div className="mt-3 bg-white/10 rounded-lg p-2 flex items-center justify-center gap-2">
          <span className="/80 text-xs">Desempenho médio:</span>
          <span className=" font-bold text-sm">
            {performanceAvg.toFixed(1)}
          </span>
        </div>
      )}
    </div>
  );
};

export const MainStatsFlashcard = memo(MainStatsFlashcardComponent);
MainStatsFlashcard.displayName = "MainStatsFlashcard";
