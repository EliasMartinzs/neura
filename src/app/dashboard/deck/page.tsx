"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { useSearchParams } from "next/navigation";
import { DeckToolbar } from "./_components/deck-toolbar";
import { Decks } from "./_components/decks";
import { DeckDocumentation } from "./_components/deck-documentation";
import { useDeckFilterStore } from "@/features/deck/store/use-deck-filter-store";
import { Suspense } from "react";

export default function DeckPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q");
  const { tags, page, perPage, setPage } = useDeckFilterStore();

  const query = useGetDecks({
    page,
    perPage,
    tags: tags.length > 0 ? tags : undefined,
  });
  console.log(query.data);
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
          const filteredDecks = data?.data?.filter((deck) => {
            const matchesSearch = deck.name
              .toLowerCase()
              .includes(searchTerm ? searchTerm.toLowerCase() : "");
            return matchesSearch;
          });

          const totalPage = "totalPages" in data ? data.totalPages : 0;

          return (
            <>
              <Decks decks={filteredDecks} />

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
