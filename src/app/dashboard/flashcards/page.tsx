"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { Suspense } from "react";
import { FlashcardsDocumentation } from "./_components/flashcard-documentation";
import { Flashcards } from "./_components/flashcards";
import { FlashcardsToolbar } from "./_components/flashcards-filter";

export default function FlashcardPage() {
  const { deck, page, perPage, setPage } = useFlashcardFiltersStore();
  const { isLoading, isError, data, refetch, isFetching } = useGetFlashcards({
    deck: deck,
    page: page,
    perPage: perPage,
  });

  const flashcards = data?.data ?? [];
  const totalPages = (data as { totalPages?: number })?.totalPages ?? 0;

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        <Title>Flashcards</Title>

        <Suspense fallback={null}>
          <FlashcardsToolbar />
        </Suspense>
      </div>

      <FlashcardsDocumentation />

      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar os flashcards.
          </p>
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

          <Flashcards flashcards={flashcards} />

          {flashcards.length > 0 && (
            <PaginationComponent
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          )}
        </>
      )}
    </main>
  );
}
