"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { useDeckFilterStore } from "@/features/deck/store/use-deck-filter-store";
import { useDebounce } from "@/hooks/use-debounce";
import { getQueryState } from "@/lib/query/use-query-state";
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

  const { isLoading, isError, data, refetch, isFetching } = getQueryState(query);

  const decks = data?.data ?? [];
  const totalPages = (data as { totalPages?: number })?.totalPages ?? 0;

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Title>Decks</Title>
        <Suspense fallback={null}>
          <DeckToolbar />
        </Suspense>
      </div>

      <DeckDocumentation />

      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-muted-foreground">Ocorreu um erro ao carregar os decks.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isFetching && (
            <div className="fixed top-4 right-4 z-50">
              <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
            </div>
          )}

          <Decks decks={decks} />

          {decks.length > 0 && (
            <PaginationComponent
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </main>
  );
}