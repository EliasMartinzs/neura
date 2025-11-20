"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { useDeckFiltersStore } from "@/features/deck/store/use-deck-filters-store";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { CreateDeckButton } from "./_components/create-deck-button";
import { DeckFilters } from "./_components/deck-filters";
import { Decks } from "./_components/decks";
import { Suspense } from "react";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";

export default function DeckPage() {
  const { tags, page, perPage, setPage } = useDeckFiltersStore();

  const query = useGetDecks({
    page,
    perPage,
    tags: tags.length > 0 ? tags : undefined,
  });

  return (
    <main className="space-y-6">
      <Suspense>
        <Title action={<CreateDeckButton />}>Meus decks</Title>
      </Suspense>

      <DeckFilters />

      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
        empty={<EmptyState />}
      >
        {(data) => (
          <>
            <Decks decks={data?.data} />

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
