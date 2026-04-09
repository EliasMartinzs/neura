"use client";

import { useParams } from "next/navigation";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { useGetDeck } from "@/features/deck/api/use-get-deck";
import { useStartStudy } from "@/features/study/api/use-start-session";
import { useState } from "react";
import { DeckAnimations } from "./_components/deck-animations";
import { DeckCard } from "./_components/deck-card";
import { DeckInputSearch } from "./_components/deck-input-search";
import { DeckSearchedFlashcard } from "./_components/deck-searched-flashcard";
import { DeckStats } from "./_components/deck-stats";

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const [showAllTags, setShowAllTags] = useState(false);
  const [expandedStats, setExpandedStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const { isLoading, isError, data, refetch, isFetching } = useGetDeck(id);
  const { mutate: mutateStart } = useStartStudy();

  async function handleStartStudy() {
    mutateStart({
      deckId: id,
    });
  }

  const deck = data?.data;
  const flashcards = deck?.flashcards ?? [];
  const tags = deck?.tags ?? [];
  const performance = deck?.performance ?? { accuracyRate: 0, averageGrade: 0 };

  const displayedTags = showAllTags ? tags : tags.slice(0, 6);
  const filteredFlashcards = flashcards.filter((fc) =>
    fc.front.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
      </div>
    );
  }

  if (isError || !deck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar o deck.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      <DeckAnimations />

      <BreadcrumbCustom href="/dashboard/deck" label="Voltar para Decks" />

      <DeckCard
        deck={deck}
        displayedTags={displayedTags}
        setShowAllTags={setShowAllTags}
        showAllTags={showAllTags}
        handleStartStudy={handleStartStudy}
      />

      <DeckStats
        expandedStats={expandedStats}
        setExpandedStats={setExpandedStats}
        totalCards={deck._count.flashcards || 0}
        reviewCount={deck.reviewCount || 0}
        accuracyRate={performance.accuracyRate}
        averageGrade={performance.averageGrade}
      />

      <DeckInputSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <DeckSearchedFlashcard
        filteredFlashcards={filteredFlashcards}
        searchTerm={searchTerm}
      />
    </div>
  );
}
