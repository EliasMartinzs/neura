import { Tooltip } from "@/components/shared/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";

import { useGetDeckNames } from "@/features/deck/api/use-get-deck-names";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";

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
  const { isLoading, isError, data, refetch, isFetching } = useGetDeckNames({
    hasFlashcard: true,
  });

  const decks = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="w-full flex max-sm:flex-col gap-4 justify-between">
        {isLoading && (
          <div className="flex items-center justify-center p-2">
            <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center p-2">
            <button
              onClick={() => refetch()}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {isFetching && (
              <div className="absolute top-2 right-2">
                <div className="animate-spin w-4 h-4 border border-muted border-t-primary rounded-full" />
              </div>
            )}

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
                    content={<p className="text-sm">Filtrar por deck</p>}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  {decks.map((d) => (
                    <p
                      key={d.id}
                      onClick={() => onSet(d.name)}
                      className={cn(
                        "flex items-center gap-x-4 text-muted-foreground cursor-pointer",
                        deck === d.name && "text-foreground",
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
                          "flex items-center gap-x-4 text-muted-foreground cursor-pointer",
                          perPage === page && "text-foreground",
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
          </>
        )}
      </div>
    </div>
  );
};
