"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useGetFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { Plus } from "lucide-react";
import { CreateFlashcardButton } from "./_components/create-flashcard-button";
import { Flashcards } from "./_components/flashcards";
import { FlashcardsFilters } from "./_components/flashcards-filters";
import { Suspense } from "react";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";

export default function FlashcardPage() {
  const { deck, page, perPage, setPage } = useFlashcardFiltersStore();
  const query = useGetFlashcards({
    deck: deck,
    page: page,
    perPage: perPage,
  });

  return (
    <main className="space-y-6">
      <Title
        action={
          <Suspense>
            <CreateFlashcardButton
              trigger={
                <Button variant="outline" className="">
                  Novo card <Plus className="w-5 h-5 " />
                </Button>
              }
            />
          </Suspense>
        }
      >
        Flashcards
      </Title>

      <FlashcardsFilters />

      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
        empty={<EmptyState />}
      >
        {(data) => (
          <>
            <Flashcards flashcards={data.data} />

            <PaginationComponent
              page={page}
              totalPages={"totalPages" in data ? data.totalPages : 0}
              setPage={setPage}
            />
          </>
        )}
      </QueryState>
    </main>
  );
}
