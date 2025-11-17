"use client";

import { useParams } from "next/navigation";
import ErroImage from "../../../../../public/undraw_connection-lost.svg";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DIFFICULTY } from "@/constants/difficulty";
import { useGetDeck } from "@/features/deck/api/use-get-deck";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { useResetStudy } from "@/features/study/use-reset-study";
import { useStartStudy } from "@/features/study/use-start-session";
import { DeckDifficulty } from "@prisma/client";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Flame,
  Loader2,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CreateFlashcardButton } from "../../flashcards/_components/create-flashcard-button";
import { EditDeckButton } from "../_components/edit-deck-button";
import { MoveTrashButton } from "../_components/move-trash-button";
import { DeleteFlashcardButton } from "../../flashcards/_components/delete-flashcard-button";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

type Flashcard = NonNullable<
  NonNullable<ResponseGetDecks>["data"]
>[number]["flashcards"];

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const [showAllTags, setShowAllTags] = useState(false);
  const [expandedStats, setExpandedStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { deck, isLoading, isError, refetch, isFetching } = useGetDeck(id);
  const { mutate: mutateStart } = useStartStudy();
  const { mutate: mutateReset } = useResetStudy(deck?.studySessions[0]?.id!);

  if (isLoading) {
    return (
      <div className="w-full min-h-64 grid place-items-center">
        <Loader2 className="animate-spin size-7 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[65svh] flex flex-col items-center justify-center">
        <Image src={ErroImage} alt="error image" className="size-96" />

        <div className="flex flex-col justify-center items-center gap-y-4">
          <h4 className="text-lg text-muted-foreground">
            Houve um erro ao buscar os dados, Tente novamente
          </h4>

          <Button
            variant={"destructive"}
            disabled={isFetching}
            size={"sm"}
            className="w-fit"
            onClick={() => refetch()}
          >
            {isFetching ? (
              <Loader2 className="animate-spin size-5 text-muted-foreground" />
            ) : (
              "Recarregar"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!deck) {
    return <></>;
  }

  const { flashcards, tags, performance } = deck;

  const displayedTags = showAllTags ? tags : tags.slice(0, 6);
  const filteredFlashcards = flashcards.filter((fc) =>
    fc.front.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleStartStudy() {
    mutateStart({
      deckId: id,
    });
  }

  async function handleResetStudy() {
    mutateReset();
  }

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
      {/* Animation */}
      <Animations />

      {/* Back to decks */}
      <BreadcrumbCustom href="/dashboard/deck" label="Voltar para Decks" />

      {/* Card */}
      <Card
        deck={deck}
        displayedTags={displayedTags}
        setShowAllTags={setShowAllTags}
        showAllTags={showAllTags}
        handleStartStudy={handleStartStudy}
        handleResetStudy={handleResetStudy}
      />

      {/* Stats */}
      <Stats
        expandedStats={expandedStats}
        setExpandedStats={setExpandedStats}
        totalCards={deck._count.flashcards}
        reviewCount={deck.reviewCount}
        accuracyRate={performance.accuracyRate}
        averageGrade={performance.averageGrade}
      />

      {/* Search Flashcard */}
      <InputSearch
        filteredFlashcards={filteredFlashcards}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Searched Flashcards */}
      <SearchedFlashcard
        filteredFlashcards={filteredFlashcards}
        searchTerm={searchTerm}
      />
    </div>
  );
}

const Animations = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      ></div>

      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s" }}
      ></div>
    </div>
  );
};

const Card = ({
  deck: {
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
  },
  displayedTags,
  setShowAllTags,
  showAllTags,
  handleStartStudy,
  handleResetStudy,
}: {
  deck: Deck;
  displayedTags: string[];
  setShowAllTags: (prev: boolean) => void;
  showAllTags: boolean;
  handleStartStudy: () => void;
  handleResetStudy: () => void;
}) => {
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
        }}
      >
        {/* Decoration and Animations Flashcard */}
        <>
          <div className="absolute inset-0 bg-linear-to-br from-white/10 via-transparent to-black/20"></div>
          <div
            className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-br-full animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-tl-full animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "3s",
                }}
              ></div>
            ))}
          </div>
        </>

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

            <Button
              size={"lg"}
              variant="icon"
              className="p-3 bg-white/15 backdrop-blur-xl rounded-xl hover:bg-green-500/30 transition-all duration-300 hover:scale-110 hover:rotate-12 border border-white/20 shadow-lg group"
              onClick={handleResetStudy}
              disabled={flashcards.length === 0}
            >
              <RotateCcw className="w-5 h-5 group-hover:text-green-100 " />
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
            />

            <MoveTrashButton id={id} redirect="/dashboard/deck" />

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

const Stats = ({
  expandedStats,
  setExpandedStats,
  totalCards,
  reviewCount,
  accuracyRate,
  averageGrade,
}: {
  setExpandedStats: (prev: boolean) => void;
  expandedStats: boolean;
  totalCards: number;
  reviewCount: number | null;
  accuracyRate: number;
  averageGrade: number;
}) => {
  return (
    <>
      <button
        onClick={() => setExpandedStats(!expandedStats)}
        className="flex items-center gap-3 hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
      >
        <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xl">Estatísticas e Performance</span>
        <div
          className={`transition-transform duration-300 ${
            expandedStats ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {expandedStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                </div>
                <Sparkles className="w-5 h-5 text-blue-700 dark:text-blue-300 animate-pulse" />
              </div>
              <div className="text-5xl font-black mb-2 ">{totalCards}</div>
              <div className="text-blue-700 dark:text-blue-300/80 text-sm font-semibold uppercase tracking-wide">
                Total de Cards
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-blue-500/50 to-cyan-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-purple-500/30 to-pink-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-purple-700 dark:text-purple-300" />
                </div>
                <Trophy className="w-5 h-5 text-purple-700 dark:text-purple-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">{reviewCount}</div>
              <div className="text-purple-700 dark:text-purple-300/80 text-sm font-semibold uppercase tracking-wide">
                Revisões Feitas
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-purple-500/50 to-pink-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-green-700 dark:text-green-300" />
                </div>
                <Award className="w-5 h-5 text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(accuracyRate * 100)}
                %
              </div>
              <div className="text-green-700 dark:text-green-300/80 text-sm font-semibold uppercase tracking-wide">
                Taxa de Acerto
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-green-500/50 to-emerald-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-yellow-700 dark:text-yellow-300" />
                </div>
                <Zap className="w-5 h-5 text-yellow-700 dark:text-yellow-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(averageGrade)}
              </div>
              <div className="text-yellow-700 dark:text-yellow-300/80 text-sm font-semibold uppercase tracking-wide">
                Performance Média
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-yellow-500/50 to-orange-500/50 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InputSearch = ({
  filteredFlashcards,
  searchTerm,
  setSearchTerm,
}: {
  filteredFlashcards: Flashcard;
  searchTerm: string;
  setSearchTerm: (event: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 hover:transition-all group px-4 py-2 rounded-xl hover:bg-white/5">
        <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xl">Flashcards</span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10"
          />
        </div>

        <CreateFlashcardButton
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
    </div>
  );
};

const SearchedFlashcard = ({
  filteredFlashcards,
  searchTerm,
}: {
  filteredFlashcards: Flashcard;
  searchTerm: string;
}) => {
  return (
    <>
      {filteredFlashcards.length === 0 ? (
        <div className="relative group">
          <div className="absolute -inset-1 text-primary-foreground bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl"></div>
          <div className="relative rounded-3xl p-16 text-center">
            <div className="inline-block p-6 bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90  rounded-4xl mb-6">
              <BookOpen className="w-20 h-20 text-purple-400/50" />
            </div>
            <p className="text-xl font-semibold mb-2 text-white">
              {searchTerm
                ? "Nenhum flashcard encontrado"
                : "Nenhum flashcard neste deck ainda"}
            </p>
            <p className="text-white text-sm">
              {searchTerm
                ? "Tente buscar por outro termo"
                : "Crie seu primeiro flashcard para começar a estudar!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredFlashcards.map((flashcard) => {
            const allGrades = flashcard.reviews.map((r: any) => r.grade);
            const averageGrade =
              allGrades.length > 0
                ? allGrades.reduce((sum: number, g: number) => sum + g, 0) /
                  allGrades.length
                : 0;

            const percentage = Math.round(averageGrade ?? 0);

            return (
              <div key={flashcard.id} className="relative group cursor-pointer">
                <div className="relative rounded-2xl p-6 transition-all duration-300 group-hover:scale-105 overflow-hidden h-full flex flex-col gap-y-4 border">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/flashcards/${flashcard.id}`}
                      className="font-bold text-lg mb-4 line-clamp-3 transition-colors leading-tight flex-1 hover:underline"
                    >
                      {flashcard.front || "Flashcard"}
                    </Link>

                    <DeleteFlashcardButton color={""} id={flashcard.id} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2  text-sm">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium">
                          {flashcard.reviews.length} revisões
                        </span>
                      </div>
                      {averageGrade !== null && averageGrade >= 80 && (
                        <div>
                          <div className="p-1.5 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < percentage ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
