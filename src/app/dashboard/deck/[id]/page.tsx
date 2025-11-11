"use client";

import { useParams } from "next/navigation";
import ErroImage from "../../../../../public/undraw_connection-lost.svg";

import { Button } from "@/components/ui/button";
import { DIFFICULTY } from "@/constants/difficulty";
import { useGetDeck } from "@/features/deck/api/use-get-deck";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { cn } from "@/lib/utils";
import { DeckDifficulty } from "@prisma/client";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit3,
  Flame,
  Loader2,
  Play,
  Plus,
  Search,
  Sparkles,
  Star,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { getForeground } from "@/constants/circle-colors";
import { Input } from "@/components/ui/input";
import { EditDeckButton } from "../_components/edit-deck-button";
import { MoveTrashButton } from "../_components/move-trash-button";
import { CreateFlashcardButton } from "../../flashcards/_components/create-flashcard-button";
import Link from "next/link";

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

  const { _count, flashcards, lastStudiedAt, tags } = deck;

  const totalReviews = flashcards.reduce(
    (sum, fc) => sum + fc.reviews.length,
    0
  );

  const averagePerformance =
    flashcards.length > 0
      ? flashcards.reduce((sum, fc) => sum + (fc.performanceAvg || 0), 0) /
        flashcards.length
      : 0;

  const calculateOverallAccuracy = () => {
    const allReviews = flashcards.flatMap((fc) => fc.reviews);
    if (allReviews.length === 0) return 0;
    const totalGrades = allReviews.reduce(
      (sum, review) => sum + review.grade,
      0
    );
    const maxPossible = allReviews.length * 5;
    return Math.round((totalGrades / maxPossible) * 100);
  };

  const overallAccuracy = calculateOverallAccuracy();

  const cardsToReview = flashcards.filter(
    (fc) => !fc.nextReview || new Date(fc.nextReview) <= new Date()
  ).length;

  const studyStreak = lastStudiedAt
    ? Math.floor(
        (Date.now() - new Date(lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const displayedTags = showAllTags ? tags : tags.slice(0, 6);
  const filteredFlashcards = flashcards.filter((fc) =>
    fc.front.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
      {/* Animation */}
      <Animations />

      {/* Back to decks */}
      <Breadcrumb />

      {/* Card */}
      <Card
        cardsToReview={cardsToReview}
        deck={deck}
        displayedTags={displayedTags}
        studyStreak={studyStreak}
        setShowAllTags={setShowAllTags}
        showAllTags={showAllTags}
      />

      {/* Stats */}
      <Stats
        averagePerformance={averagePerformance}
        expandedStats={expandedStats}
        overallAccuracy={overallAccuracy}
        setExpandedStats={setExpandedStats}
        totalReviews={totalReviews}
        countFlashcards={_count.flashcards}
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

const Breadcrumb = () => {
  return (
    <Link
      href="/dashboard/deck"
      className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
      <span className="font-medium">Voltar para Decks</span>
    </Link>
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
  cardsToReview,
  displayedTags,
  studyStreak,
  setShowAllTags,
  showAllTags,
}: {
  deck: Deck;
  cardsToReview: number;
  studyStreak: number;
  displayedTags: string[];
  setShowAllTags: (prev: boolean) => void;
  showAllTags: boolean;
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
            />

            <MoveTrashButton id={id} redirect="/dashboard/deck" />

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

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-bold">
                {_count.flashcards} cards
              </span>
            </div>
            {cardsToReview > 0 && (
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20 animate-pulse">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="text-sm font-bold">
                  {cardsToReview} para revisar
                </span>
              </div>
            )}
            {studyStreak < 7 && lastStudiedAt && (
              <div className="flex items-center gap-2 bg-orange-500/20 backdrop-blur-xl px-4 py-2 rounded-full border border-orange-400/30">
                <Trophy className="w-4 h-4 text-orange-300" />
                <span className="text-sm font-bold">
                  {studyStreak}d sem estudar
                </span>
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
  averagePerformance,
  expandedStats,
  overallAccuracy,
  setExpandedStats,
  totalReviews,
  countFlashcards,
}: {
  setExpandedStats: (prev: boolean) => void;
  expandedStats: boolean;
  totalReviews: number;
  overallAccuracy: number;
  averagePerformance: number;
  countFlashcards: number;
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
            <div className="relative text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                </div>
                <Sparkles className="w-5 h-5 text-blue-700 dark:text-blue-300 animate-pulse" />
              </div>
              <div className="text-5xl font-black mb-2 ">{countFlashcards}</div>
              <div className="text-blue-700 dark:text-blue-300/80 text-sm font-semibold uppercase tracking-wide">
                Total de Cards
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-blue-500/50 to-cyan-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-purple-500/30 to-pink-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-purple-700 dark:text-purple-300" />
                </div>
                <Trophy className="w-5 h-5 text-purple-700 dark:text-purple-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">{totalReviews}</div>
              <div className="text-purple-700 dark:text-purple-300/80 text-sm font-semibold uppercase tracking-wide">
                Revisões Feitas
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-purple-500/50 to-pink-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-green-700 dark:text-green-300" />
                </div>
                <Award className="w-5 h-5 text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {overallAccuracy}%
              </div>
              <div className="text-green-700 dark:text-green-300/80 text-sm font-semibold uppercase tracking-wide">
                Taxa de Acerto
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-green-500/50 to-emerald-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-yellow-700 dark:text-yellow-300" />
                </div>
                <Zap className="w-5 h-5 text-yellow-700 dark:text-yellow-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {averagePerformance.toFixed(1)}
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
      <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
        <div
          className={cn(
            "p-2 rounded-xl text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm"
          )}
        >
          <BookOpen className="w-7 h-7 text-foreground" />
        </div>
        Flashcards <span>({filteredFlashcards.length})</span>
      </h2>

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
          <div className="absolute -inset-1 text-primary-foreground bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-xl rounded-2xl"></div>
          <div className="relative rounded-3xl p-16 text-center">
            <div className="inline-block p-6 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-3xl mb-6">
              <BookOpen className="w-20 h-20 text-purple-400/50" />
            </div>
            <p className="text-xl font-semibold mb-2">
              {searchTerm
                ? "Nenhum flashcard encontrado"
                : "Nenhum flashcard neste deck ainda"}
            </p>
            <p className=" text-sm">
              {searchTerm
                ? "Tente buscar por outro termo"
                : "Crie seu primeiro flashcard para começar a estudar!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredFlashcards.map((flashcard) => {
            const accuracy =
              flashcard.reviews.length > 0
                ? Math.round(
                    (flashcard.reviews.reduce((sum, r) => sum + r.grade, 0) /
                      (flashcard.reviews.length * 5)) *
                      100
                  )
                : null;

            return (
              <div key={flashcard.id} className="relative group cursor-pointer">
                <div className="relative bg-linear-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 group-hover:scale-105 overflow-hidden h-full flex flex-col">
                  {accuracy !== null && accuracy >= 80 && (
                    <div className="absolute top-3 right-3">
                      <div className="p-1.5 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500" />
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-lg mb-4 line-clamp-3 group-hover:text-purple-300 transition-colors leading-tight flex-1">
                    {flashcard.front || "Flashcard"}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2  text-sm">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium">
                          {flashcard.reviews.length} revisões
                        </span>
                      </div>
                      {accuracy !== null && (
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-bold text-green-400">
                            {accuracy}%
                          </div>
                        </div>
                      )}
                    </div>

                    {flashcard.performanceAvg !== null && (
                      <div className="flex items-center gap-3 rounded-lg p-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs ">Performance</span>
                            <span className="text-xs font-bold">
                              {flashcard.performanceAvg.toFixed(1)}/5.0
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${
                                  (flashcard.performanceAvg / 5) * 100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
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
