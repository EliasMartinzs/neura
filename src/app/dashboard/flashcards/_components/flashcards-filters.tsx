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

export const FlashcardsFilters = () => {
  const { clearDeck, onSet, deck, setPerPage } = useFlashcardFiltersStore();
  const { decks } = useGetDeckNames({
    hasFlashcard: true,
  });

  return (
    <div className="space-y-6">
      <Separator orientation="horizontal" />
      <h2 className="text-lg capitalize font-semibold lg:text-2xl">Filtros</h2>
      <div className="w-full flex max-sm:flex-col gap-4 justify-between">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="text-lg p-0"
                disabled={!decks?.length}
              >
                Decks
              </NavigationMenuTrigger>
              <NavigationMenuContent className="flex gap-3 min-w-fit overflow-hidden">
                {decks?.map((d) => (
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
              disabled={!decks?.length}
            >
              Limpar filtros
            </Button>
          </NavigationMenuList>
        </NavigationMenu>

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
