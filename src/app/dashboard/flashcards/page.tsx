"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { FlashcardsDocumentation } from "./_components/flashcard-documentation";
import { Flashcards } from "./_components/flashcards";
import { FlashcardsToolbar } from "./_components/flashcards-filter";
import { Suspense } from "react";

export default function FlashcardPage() {
  const { deck, page, perPage, setPage } = useFlashcardFiltersStore();
  const query = useGetFlashcards({
    deck: deck,
    page: page,
    perPage: perPage,
  });

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Title>Flashcards</Title>

        <Suspense fallback={null}>
          <FlashcardsToolbar />
        </Suspense>
      </div>

      <FlashcardsDocumentation />

      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => (
          <>
            <Flashcards flashcards={data.data} />

            {data.data?.length ? (
              <PaginationComponent
                page={page}
                totalPages={"totalPages" in data ? data.totalPages : 0}
                setPage={setPage}
              />
            ) : null}
          </>
        )}
      </QueryState>
    </main>
  );
}
