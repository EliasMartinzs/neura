import { Button } from "@/components/ui/button";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { useGetDeckNames } from "@/features/deck/api/use-get-deck-names";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";

export const FlashcardsFilters = () => {
  const { clearDeck, deck, onSet, setPerPage } = useFlashcardFiltersStore();
  const query = useGetDeckNames({
    hasFlashcard: true,
  });

  return (
    <div className="space-y-6">
      <Separator orientation="horizontal" />
      <h2 className="text-lg capitalize font-semibold lg:text-2xl">Filtros</h2>
      <div className="w-full flex max-sm:flex-col gap-4 justify-between">
        <QueryState
          query={query}
          loading={<LoadingState />}
          error={({ refetch }) => <ErrorState onRetry={refetch} />}
          empty={<EmptyState />}
          fetchingIndicator={<FetchingIndicatorState />}
        >
          {(data) => (
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="text-lg p-0"
                    disabled={!data.data?.length}
                  >
                    Decks
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="flex gap-3 min-w-fit overflow-hidden">
                    {data.data?.map((d) => (
                      <Button
                        key={d.id}
                        onClick={() => onSet(d.name)}
                        variant={d.name === deck ? "outline" : "ghost"}
                        className="w-auto"
                      >
                        {d.name}
                      </Button>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <Button
                  variant={"ghost"}
                  onClick={clearDeck}
                  disabled={!data.data?.length}
                >
                  Limpar filtros
                </Button>
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </QueryState>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-x-3">
          <p>Decks por paginas</p>
          <NativeSelect>
            {[10, 20, 50].map((page) => (
              <NativeSelectOption
                key={page}
                value={page}
                onClick={() => setPerPage(page)}
              >
                {page}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
      </div>
    </div>
  );
};
