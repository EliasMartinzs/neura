import { CreateFlashcardButton } from "@/app/dashboard/flashcards/_components/create-flashcard-button";
import { Button } from "@/components/ui/button";
import { DIFFICULTY } from "@/constants/difficulty";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { DeckDifficulty } from "@prisma/client";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit,
  Flame,
  Play,
  Plus,
  RotateCcw,
  Tag,
  Target,
  Trash,
  Trophy,
} from "lucide-react";
import { EditDeckButton } from "../../_components/edit-deck-button";
import { MoveTrashButton } from "../../_components/move-trash-button";
import { getForeground } from "@/constants/circle-colors";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

export const DeckCard = ({
  deck,
  displayedTags,
  setShowAllTags,
  showAllTags,
  handleStartStudy,
}: {
  deck: Deck;
  displayedTags: string[];
  setShowAllTags: (prev: boolean) => void;
  showAllTags: boolean;
  handleStartStudy: () => void;
}) => {
  const {
    _count,
    color,
    createdAt,
    description,
    difficulty,
    flashcards,
    id,
    lastStudiedAt,
    name,
    reviewCount,
    tags,
  } = deck;

  return (
    <div className="relative">
      <div
        className="absolute -inset-1 rounded-3xl blur-3xl opacity-60 animate-pulse"
        style={{
          background:
            color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          animationDuration: "3s",
        }}
      ></div>

      <div
        className="relative rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        style={{
          background:
            color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: getForeground(color || ""),
        }}
      >
        <div className="relative p-6 md:p-10">
          {/* Actions Buttons */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <Button
              size={"lg"}
              variant="icon"
              className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-110 hover:rotate-12 border border-white/20 shadow-lg group"
              onClick={handleStartStudy}
              disabled={flashcards.length === 0}
            >
              <Play className="w-5 h-5 group-hover:text-green-100 " />
            </Button>

            <EditDeckButton
              deck={{
                _count,
                color,
                createdAt,
                description,
                difficulty,
                lastStudiedAt,
                name,
                tags,
                flashcards,
                id,
                reviewCount,
              }}
              trigger={
                <Button
                  size={"lg"}
                  variant="icon"
                  className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-white/20 shadow-lg group"
                >
                  <Edit className="w-5 h-5 group-hover:text-green-100 " />
                </Button>
              }
            />

            <MoveTrashButton
              id={id}
              redirect="/dashboard/deck"
              trigger={
                <Button
                  size={"lg"}
                  variant="icon"
                  className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-white/20 shadow-lg group"
                >
                  <Trash className="w-5 h-5 group-hover:text-green-100 " />
                </Button>
              }
            />

            <CreateFlashcardButton
              deckId={id}
              trigger={
                <Button
                  size={"lg"}
                  variant="icon"
                  className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-white/20 shadow-lg group"
                >
                  <Plus className="w-5 h-5 group-hover:text-green-100 " />
                </Button>
              }
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold">
                {_count.flashcards} cards
              </span>
            </div>
            {0 > 0 && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 animate-pulse">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold">{0} para revisar</span>
              </div>
            )}
            {0 < 7 && lastStudiedAt && (
              <div className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-xl px-4 py-2 rounded-full border border-orange-400/30">
                <Trophy className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-bold">{0}d sem estudar</span>
              </div>
            )}
          </div>

          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-6xl font-black mb-4 capitalize drop-shadow-2xl leading-tight">
              {name}
            </h1>
            {description && (
              <p className="text-white/90 text-base md:text-lg leading-relaxed backdrop-blur-sm bg-black/10 rounded-xl p-4 border border-white/10">
                {description}
              </p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-wrap gap-2">
                {displayedTags.map((tag, index) => (
                  <div
                    key={`${tag}-${index}`}
                    className="group px-4 py-2 bg-white/15 backdrop-blur-xl rounded-full border border-white/20 text-sm font-medium hover:bg-white/25 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
                  >
                    <Tag className="w-3 h-3 inline mr-2 group-hover:rotate-12 transition-transform" />
                    {tag}
                  </div>
                ))}
                {tags.length > 6 && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="px-4 py-2 bg-white/25 backdrop-blur-xl rounded-full border border-white/30 text-sm font-medium hover:bg-white/35 hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  >
                    {showAllTags ? "Menos tags" : `+${tags.length - 6} tags`}
                    {showAllTags ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 md:gap-6 text-sm">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <Calendar className="w-4 h-4" />
              <span>
                Criado em {new Date(createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {lastStudiedAt && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Clock className="w-4 h-4" />
                <span>
                  Último estudo:{" "}
                  {new Date(lastStudiedAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}
            {difficulty && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
                <Target className="w-4 h-4" />
                <span>{DIFFICULTY[difficulty as DeckDifficulty]}</span>
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent"></div>
      </div>
    </div>
  );
};
