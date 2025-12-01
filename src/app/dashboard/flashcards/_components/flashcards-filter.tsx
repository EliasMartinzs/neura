import { Tooltip } from "@/components/shared/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";

import { useGetDeckNames } from "@/features/deck/api/use-get-deck-names";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ArrowDown01, BookmarkX, Check, Funnel, Plus } from "lucide-react";
import { CreateFlashcardButton } from "./create-flashcard-button";
import { OpenFlashcardDocumentation } from "./open-flashcard-documentation";

export const FlashcardsToolbar = () => {
  const { clearDeck, perPage, onSet, setPerPage, deck } =
    useFlashcardFiltersStore();
  const query = useGetDeckNames({
    hasFlashcard: true,
  });

  return (
    <div className="space-y-6">
      <div className="w-full flex max-sm:flex-col gap-4 justify-between">
        <QueryState
          query={query}
          loading={<LoadingState />}
          error={({ refetch }) => <ErrorState onRetry={refetch} />}
          fetchingIndicator={<FetchingIndicatorState />}
        >
          {(data) => (
            <div className="flex">
              <CreateFlashcardButton
                trigger={
                  <Button variant="ghost">
                    <Tooltip
                      trigger={<Plus className="size-5" />}
                      content={<p className="text-sm">Criar novo deck</p>}
                    />
                  </Button>
                }
              />

              <OpenFlashcardDocumentation />

              <Popover>
                <PopoverTrigger>
                  <Tooltip
                    trigger={
                      <div className={buttonVariants({ variant: "ghost" })}>
                        <Funnel className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                      </div>
                    }
                    content={<p className="text-sm">Filtrar por tags</p>}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  {data?.data?.map((d) => (
                    <p
                      key={d.id}
                      onClick={() => onSet(d.name)}
                      className={cn(
                        "flex items-center gap-x-4 text-muted-foreground",
                        deck === d.name && "text-foreground"
                      )}
                    >
                      {d.name}

                      {deck === d.name && <Check className="size-4" />}
                    </p>
                  ))}
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger>
                  <Tooltip
                    trigger={
                      <div className={buttonVariants({ variant: "ghost" })}>
                        <ArrowDown01 className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                      </div>
                    }
                    content={<p className="text-sm">Items por pagina</p>}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="">
                    {[5, 10, 20, 50].map((page) => (
                      <p
                        key={page}
                        className={cn(
                          "flex items-center gap-x-4 text-muted-foreground",
                          perPage === page && "text-foreground"
                        )}
                        onClick={() => setPerPage(page)}
                      >
                        {page}

                        {perPage === page && <Check className="size-4" />}
                      </p>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip
                trigger={
                  <div
                    className={buttonVariants({ variant: "ghost" })}
                    onClick={clearDeck}
                  >
                    <BookmarkX className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                  </div>
                }
                content={<p className="text-sm">Limpar filtros</p>}
              />
            </div>
          )}
        </QueryState>
      </div>
    </div>
  );
};
