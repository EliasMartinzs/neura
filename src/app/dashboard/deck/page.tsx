"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { useDeckFilterStore } from "@/features/deck/store/use-deck-filter-store";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { Suspense } from "react";
import { DeckDocumentation } from "./_components/deck-documentation";
import { DeckToolbar } from "./_components/deck-toolbar";
import { Decks } from "./_components/decks";

export default function DeckPage() {
  const { tags, page, perPage, setPage, search } = useDeckFilterStore();

  const debouncedSearch = useDebounce(search, 400);

  const query = useGetDecks({
    page,
    perPage,
    tags: tags.length > 0 ? tags : undefined,
    search: debouncedSearch || undefined,
  });

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Title>Decks</Title>
        <Suspense fallback={null}>
          <DeckToolbar />
        </Suspense>
      </div>

      <DeckDocumentation />

      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => {
          const totalPage = "totalPages" in data ? data.totalPages : 0;

          return (
            <>
              <Decks decks={data.data} />

              {data.data?.length ? (
                <PaginationComponent
                  page={page}
                  setPage={setPage}
                  totalPages={totalPage}
                />
              ) : null}
            </>
          );
        }}
      </QueryState>
    </main>
  );
}
