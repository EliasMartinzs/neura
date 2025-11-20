import { ResponseFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useRouter } from "next/navigation";

import { Tooltip } from "@/components/shared/tooltip";
import { Button } from "@/components/ui/button";
import { getForeground } from "@/constants/circle-colors";
import { FlashcardDifficulty } from "@/constants/flashcard-difficulty";
import { $Enums } from "@prisma/client";
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  Info,
  TrendingUp,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { DeleteFlashcardButton } from "./delete-flashcard-button";

type Flashcard = NonNullable<NonNullable<ResponseFlashcards>["data"]>[number];

type Props = {
  flashcard: Flashcard;
};

export const FlashcardItem = ({ flashcard }: Props) => {
  const router = useRouter();

  return (
    <div className="relative group w-auto h-full">
      {/* Decorative and Animations */}
      <DecorativesAndAnimations color={flashcard.color} />

      {/* Card */}
      <Card flashcard={flashcard} router={router} />

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white to-transparent opacity-40"></div>
    </div>
  );
};

const DecorativesAndAnimations = ({ color }: { color: string | null }) => (
  <>
    <div
      className="absolute -inset-1 rounded-2xl blur-xl opacity-0 hover:opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 -z-10"
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    ></div>
    <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/10 rounded-tl-full"></div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      ></div>
    </div>
  </>
);

const Card = ({
  flashcard,
  router,
}: {
  flashcard: Flashcard;
  router: AppRouterInstance;
}) => {
  const {
    id,
    front,
    color,
    difficulty,
    createdAt,
    deck,
    _count,
    performanceAvg,
    repetition,
  } = flashcard;
  return (
    <div
      className="relative rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full"
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: getForeground(color || ""),
      }}
    >
      {/* Action buttons */}
      <ActionsButtons color={color} id={id} router={router} />

      {/* Header - Front do Flashcard */}
      <HeaderFront color={color} front={front} />

      {/* Main Stats */}
      <div className="relative px-6 py-4">
        <MainStats
          _count={_count}
          difficulty={difficulty}
          performanceAvg={performanceAvg}
          repetition={repetition}
        />
      </div>

      {/* Footer - Deck e Data */}
      <Footer createdAt={createdAt} name={deck?.name} />
    </div>
  );
};

const ActionsButtons = ({
  router,
  color,
  id,
}: {
  router: AppRouterInstance;
  color: string | null;
  id: string;
}) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      <DeleteFlashcardButton color={color || ""} id={id} />
      <Button
        variant={"icon"}
        title="Ver detalhes completos"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/dashboard/flashcards/${id}`);
        }}
        className="hover:-rotate-12"
      >
        <Info className="w-4 h-4  group-hover/btn:text-blue-100 hover:-rotate-12" />
      </Button>
    </div>
  );
};

const HeaderFront = ({
  color,
  front,
}: {
  front: string;
  color: string | null;
}) => {
  return (
    <Tooltip
      trigger={
        <div className="relative pt-20 px-6 pb-4">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
            <h2 className=" text-xl font-bold text-center leading-relaxed capitalize line-clamp-1">
              {front}
            </h2>
          </div>
        </div>
      }
      content={front}
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textAlign: "center",
        color: getForeground(color || ""),
      }}
    />
  );
};

const MainStats = ({
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

const Footer = ({
  createdAt,
  name,
}: {
  createdAt: string;
  name: string | undefined;
}) => {
  return (
    <div className="relative px-6 pb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between /90 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">
              {new Date(createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {name && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full min-w-0 max-w-[60%]">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-medium truncate">{name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
