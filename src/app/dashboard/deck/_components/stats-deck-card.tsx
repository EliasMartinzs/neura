import { DIFFICULTY } from "@/constants/difficulty";
import { $Enums } from "@prisma/client";
import { BookOpen, Sparkles, Target, TrendingUp } from "lucide-react";
import { memo } from "react";

const StatsDeckCardComponet = ({
  _count,
  difficulty,
  lastStudiedAt,
  reviewCount,
  color,
}: {
  _count: { flashcards: number };
  reviewCount: number | null;
  difficulty: $Enums.DeckDifficulty | null;
  lastStudiedAt: string | null;
  color: string | null;
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
      <div className="grid grid-cols-2 gap-4">
        {/* Flashcards Count */}
        <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
          <BookOpen className="w-7 h-7  mb-2" />
          <div className="text-3xl font-bold ">{_count.flashcards}</div>
          <div className="text-xs font-medium mt-1">Flashcards</div>
        </div>

        {/* Review Count */}
        <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
          <TrendingUp className="w-7 h-7 text-green-300 mb-2" />
          <div className="text-3xl font-bold ">{reviewCount || 0}</div>
          <div className="text-xs font-medium mt-1">Revisões</div>
        </div>
      </div>

      {/* Difficulty indicator */}
      {difficulty && (
        <div className="flex items-center justify-center gap-3 mt-4 bg-white/10 rounded-lg p-3">
          <Target className="w-5 h-5 text-yellow-300" />
          <div className="flex gap-1.5">
            {["EASY", "MEDIUM", "HARD"].map((level, index) => {
              const isActive =
                ["EASY", "MEDIUM", "HARD"].indexOf(difficulty) >= index;
              return (
                <div
                  key={level}
                  className={`w-2 h-6 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-linear-to-t from-yellow-400 to-yellow-200 shadow-lg"
                      : "bg-white/20"
                  }`}
                ></div>
              );
            })}
          </div>
          <span className="text-sm font-semibold">
            {DIFFICULTY[difficulty as $Enums.DeckDifficulty] || difficulty}
          </span>
        </div>
      )}

      {/* Last studied */}
      {lastStudiedAt && (
        <div className="mt-3 bg-white/10 rounded-lg p-2 flex items-center justify-center gap-2">
          <Sparkles className="size-5" />
          <span className="text-xs">Último estudo:</span>
          <span className="font-medium text-xs">
            {new Date(lastStudiedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      )}
    </div>
  );
};

export const StatsDeckCard = memo(StatsDeckCardComponet);
StatsDeckCard.displayName = "StatsDeckCard";
