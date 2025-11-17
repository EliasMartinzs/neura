import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { useGetAllTags } from "@/features/deck/api/use-get-tags";
import { useDeckFiltersStore } from "@/features/deck/store/use-deck-filters-store";
import { useTrashStore } from "@/features/deck/store/use-trash-store";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import ErrorImage from "../../../../../public/undraw_connection-lost.svg";
import LoadingImage from "../../../../../public/undraw_loading.svg";

export const DeckFilters = () => {
  const { data, isLoading, isError, refetch } = useGetAllTags();
  const { tags, toggleTag, clearTags, setPerPage } = useDeckFiltersStore();
  const { onOpen } = useTrashStore();

  if (isLoading) {
    return (
      <div className="w-full min-h-[65svh] overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
        <Image
          src={LoadingImage}
          alt="loading"
          width={380}
          height={380}
          className="object-center object-contain"
        />

        <h4 className="text-3xl">Carregando...</h4>
      </div>
    );
  }

  if (isError || !data) {
    <div className="w-full min-h-[65svh] overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
      <Image
        src={ErrorImage}
        alt="error"
        width={380}
        height={380}
        className="object-center object-contain"
      />

      <h4 className="text-3xl">
        Houve um erro,{" "}
        <Button onClick={() => refetch()}>Tente novamente</Button>
      </h4>
    </div>;
  }

  return (
    <div className="space-y-6">
      <Separator orientation="horizontal" />
      <h2 className="text-lg capitalize font-semibold lg:text-2xl">Filtros</h2>

      <div className="w-full flex flex-col lg:flex-row lg:justify-between max-sm:gap-4">
        {/* Tags */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className="text-lg p-0"
                disabled={!data?.data?.length}
              >
                Tags
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-sm md:min-w-md lg:min-w-lg flex flex-wrap gap-2">
                {data?.data?.map((tag) => (
                  <Button
                    key={tag}
                    variant={tags.includes(tag) ? "outline" : "ghost"}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>

            <Button
              variant={"ghost"}
              onClick={clearTags}
              disabled={!data?.data?.length}
            >
              Limpar filtros
            </Button>
          </NavigationMenuList>
        </NavigationMenu>

        <Separator orientation="vertical" />

        <div className="flex items-center gap-4">
          {/* Per page */}
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

          {/* Trash */}
          <Button onClick={() => onOpen(true)} variant={"outline"}>
            Lixeira{" "}
            <Trash2 className="text-muted-foreground hover:text-foreground duration-200 ease-in transition-all" />
          </Button>
        </div>
      </div>
    </div>
  );
};
