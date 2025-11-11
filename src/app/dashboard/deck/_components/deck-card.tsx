import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { Eye, EyeOff, Info } from "lucide-react";
import { useState } from "react";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

type Props = {
  deck: Deck;
};

import { buttonVariants } from "@/components/ui/button";
import { getForeground } from "@/constants/circle-colors";
import { DIFFICULTY } from "@/constants/difficulty";
import { $Enums, DeckDifficulty } from "@prisma/client";
import {
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Tag,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditDeckButton } from "./edit-deck-button";
import { MoveTrashButton } from "./move-trash-button";

export const DeckCard = ({ deck }: Props) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const router = useRouter();

  const displayedTags = showAllTags ? deck.tags : deck.tags.slice(0, 4);
  const hasMoreTags = deck.tags.length > 4;

  return (
    <div className="relative group h-full">
      {/* Glow effect */}
      <div
        className="absolute -inset-1 opacity-0 hover:opacity-50 rounded-2xl blur-xl group-hover:opacity-75 group-hover:scale-[103px] transition-all duration-500 -z-10"
        style={{
          background:
            deck.color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      ></div>

      {/* Card */}
      <Card
        deck={deck}
        displayedTags={displayedTags}
        hasMoreTags={hasMoreTags}
        router={router}
        setShowAllTags={setShowAllTags}
        showAllTags={showAllTags}
      />
    </div>
  );
};

const Card = ({
  deck,
  router,
  displayedTags,
  hasMoreTags,
  showAllTags,
  setShowAllTags,
}: {
  deck: Deck;
  router: AppRouterInstance;
  hasMoreTags: boolean;
  displayedTags: string[];
  showAllTags: boolean;
  setShowAllTags: (prev: boolean) => void;
}) => {
  const {
    id,
    name,
    description,
    color,
    tags,
    reviewCount,
    difficulty,
    lastStudiedAt,
    createdAt,
    _count,
  } = deck;
  return (
    <div
      className="relative h-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Decorative elements */}
      <DecorativesAndAnimations color={color} />

      {/* Action buttons */}
      <ActionsButtons deck={deck} id={id} />

      {/* Flashcard count badge */}
      <CountFlashcardsBadge _count={_count} color={color} />

      {/* Header - Nome do Deck */}
      <Header description={description} name={name} />

      {/* Main Stats */}
      <div className="relative px-6 py-4">
        <Stats
          _count={_count}
          difficulty={difficulty}
          lastStudiedAt={lastStudiedAt}
          reviewCount={reviewCount}
        />
      </div>

      {/* Tags Section */}
      <Tags
        displayedTags={displayedTags}
        hasMoreTags={hasMoreTags}
        setShowAllTags={setShowAllTags}
        showAllTags={showAllTags}
        tags={tags}
      />

      {/* Footer - Data de criação */}
      <Footer createdAt={createdAt} />

      {/* Bottom shine effect */}
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

const ActionsButtons = ({ deck, id }: { deck: Deck; id: string }) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      <EditDeckButton deck={deck} />

      <MoveTrashButton id={id} />

      <Link
        href={`/dashboard/deck/${id}`}
        className={buttonVariants({
          variant: "icon",
          size: "lg",
          className:
            "p-3 bg-white/15 backdrop-blur-xl rounded-xl transition-all duration-300 hover:scale-110 hover:-rotate-12 border border-white/20 shadow-lg group",
        })}
      >
        <Info className="w-5 h-5 " />
      </Link>
    </div>
  );
};

const CountFlashcardsBadge = ({
  _count,
  color,
}: {
  _count: { flashcards: number };
  color: string | null;
}) => {
  return (
    <div
      className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30"
      style={{ color: getForeground(color || "") }}
    >
      <Layers className="w-3.5 h-3.5" />
      <span
        className="text-xs font-bold"
        style={{
          color: getForeground(color || ""),
        }}
      >
        {_count.flashcards} cards
      </span>
    </div>
  );
};

const Header = ({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) => {
  return (
    <div className="relative pt-20 px-6 pb-4">
      <div className="text-white bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 group/header">
        <h2 className="text-2xl font-bold text-center leading-relaxed capitalize line-clamp-2 group-hover/header:line-clamp-none group-hover/header:scale-105 group-hover/header:z-50 relative transition-all duration-300">
          {name}
        </h2>
        {description && (
          <p className="text-white/80 text-sm text-center mt-3 leading-relaxed line-clamp-2 group-hover/header:line-clamp-none">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

const Stats = ({
  _count,
  difficulty,
  lastStudiedAt,
  reviewCount,
}: {
  _count: { flashcards: number };
  reviewCount: number | null;
  difficulty: $Enums.DeckDifficulty | null;
  lastStudiedAt: string | null;
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl p-5 border border-white/10">
      <div className="grid grid-cols-2 gap-4">
        {/* Flashcards Count */}
        <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
          <BookOpen className="w-7 h-7 text-white/90 mb-2" />
          <div className="text-3xl font-bold text-white">
            {_count.flashcards}
          </div>
          <div className="text-white/70 text-xs font-medium mt-1">
            Flashcards
          </div>
        </div>

        {/* Review Count */}
        <div className="bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center">
          <TrendingUp className="w-7 h-7 text-green-300 mb-2" />
          <div className="text-3xl font-bold text-white">
            {reviewCount || 0}
          </div>
          <div className="text-white/70 text-xs font-medium mt-1">Revisões</div>
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
          <span className="text-white text-sm font-semibold">
            {DIFFICULTY[difficulty as DeckDifficulty] || difficulty}
          </span>
        </div>
      )}

      {/* Last studied */}
      {lastStudiedAt && (
        <div className="mt-3 bg-white/10 rounded-lg p-2 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span className="text-white/80 text-xs">Último estudo:</span>
          <span className="text-white font-medium text-xs">
            {new Date(lastStudiedAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      )}
    </div>
  );
};

const Tags = ({
  displayedTags,
  hasMoreTags,
  setShowAllTags,
  showAllTags,
  tags,
}: {
  tags: string[];
  displayedTags: string[];
  hasMoreTags: boolean;
  showAllTags: boolean;
  setShowAllTags: (prev: boolean) => void;
}) => {
  return (
    <>
      {tags.length > 0 ? (
        <div className="relative px-6 py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedTags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white text-xs font-medium hover:bg-white/30 transition-all duration-200"
                >
                  {tag}
                </div>
              ))}
              {hasMoreTags && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllTags(!showAllTags);
                  }}
                  className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 text-white text-xs font-medium hover:bg-white/40 transition-all duration-200 flex items-center gap-1.5"
                >
                  {showAllTags ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />+{tags.length - 4}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative px-6 py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">Tags</span>
            </div>
            <span>Nenhuma tag adicionada</span>
          </div>
        </div>
      )}
    </>
  );
};

const Footer = ({ createdAt }: { createdAt: string }) => {
  return (
    <div className="relative px-6 pb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-center gap-2 text-white/90">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Criado em {new Date(createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
    </div>
  );
};
