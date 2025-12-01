"use client";

import { useParams } from "next/navigation";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { useGetDeck } from "@/features/deck/api/use-get-deck";
import { useStartStudy } from "@/features/study/api/use-start-session";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { useState } from "react";
import { DeckAnimations } from "./_components/deck-animations";
import { DeckCard } from "./_components/deck-card";
import { DeckInputSearch } from "./_components/deck-input-search";
import { DeckSearchedFlashcard } from "./_components/deck-searched-flashcard";
import { DeckStats } from "./_components/deck-stats";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";

export default function DeckPage() {
  const { id } = useParams<{ id: string }>();
  const [showAllTags, setShowAllTags] = useState(false);
  const [expandedStats, setExpandedStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const query = useGetDeck(id);
  const { mutate: mutateStart } = useStartStudy();

  async function handleStartStudy() {
    mutateStart({
      deckId: id,
    });
  }

  return (
    <div className="max-w-7xl mx-auto relative z-10 space-y-8">
      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => {
          if (!data?.data) return;

          const { flashcards, tags, performance } = data?.data;

          const displayedTags = showAllTags ? tags : tags.slice(0, 6);
          const filteredFlashcards = flashcards.filter((fc) =>
            fc.front.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return (
            <>
              {/* Animation */}
              <DeckAnimations />

              {/* Back to decks */}
              <BreadcrumbCustom
                href="/dashboard/deck"
                label="Voltar para Decks"
              />

              {/* Card */}
              <DeckCard
                deck={data?.data!}
                displayedTags={displayedTags}
                setShowAllTags={setShowAllTags}
                showAllTags={showAllTags}
                handleStartStudy={handleStartStudy}
              />

              {/* Stats */}
              <DeckStats
                expandedStats={expandedStats}
                setExpandedStats={setExpandedStats}
                totalCards={data?.data?._count.flashcards || 0}
                reviewCount={data?.data?.reviewCount || 0}
                accuracyRate={performance.accuracyRate}
                averageGrade={performance.averageGrade}
              />

              {/* Search Flashcard */}
              <DeckInputSearch
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />

              {/* Searched Flashcards */}
              <DeckSearchedFlashcard
                filteredFlashcards={filteredFlashcards}
                searchTerm={searchTerm}
              />
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
