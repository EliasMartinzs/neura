import { useGetAllTags } from "@/features/deck/api/use-get-tags";
import { useDeckFilterStore } from "@/features/deck/store/use-deck-filter-store";
import { useTrashStore } from "@/features/deck/store/use-trash-store";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import {
  ArrowDown01,
  BookmarkX,
  Check,
  Funnel,
  Search,
  Trash2,
} from "lucide-react";

import { Tooltip } from "@/components/shared/tooltip";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { ErrorState } from "@/lib/query/error-state";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { cn } from "@/lib/utils";
import { CreateDeckButton } from "./create-deck-button";
import { OpenDeckDocumentation } from "./open-deck-documentation";

export const DeckToolbar = () => {
  const query = useGetAllTags();

  const router = useRouter();
  const searchParams = useSearchParams();

  const { tags, toggleTag, reset, setPerPage, perPage } = useDeckFilterStore();
  const { onOpen } = useTrashStore();

  const initialSearch = searchParams.get("q") ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");

    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => (
          <div className="flex">
            <CreateDeckButton />

            <OpenDeckDocumentation />

            <Sheet>
              <SheetTrigger>
                <Tooltip
                  trigger={
                    <div className={buttonVariants({ variant: "ghost" })}>
                      <Search className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                    </div>
                  }
                  content={<p className="text-sm">Buscar por deck</p>}
                />
              </SheetTrigger>

              <SheetContent
                showClose={false}
                showOverlay
                side="bottom"
                className="border-none py-10"
              >
                <SheetHeader>
                  <SheetTitle className="text-center">
                    Pesquise por deck
                  </SheetTitle>
                </SheetHeader>

                <div className="relative flex items-center justify-center">
                  <Label className="relative">
                    <Input
                      value={searchTerm}
                      onChange={handleChange}
                      placeholder="Pesquise..."
                      className="max-sm:w-[90vw] md:w-md"
                    />
                    <Search className="size-5 absolute right-3" />
                  </Label>
                </div>
              </SheetContent>
            </Sheet>

            <Select>
              <SelectTrigger disabled={!data?.data?.length}></SelectTrigger>
              <SelectContent></SelectContent>
            </Select>

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
                <div className="">
                  {data?.data?.map((tag) => (
                    <p
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "flex items-center gap-x-4 text-muted-foreground",
                        tags.includes(tag) && "text-foreground"
                      )}
                    >
                      {tag}

                      {tags.includes(tag) && <Check className="size-4" />}
                    </p>
                  ))}
                </div>
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
                  onClick={reset}
                >
                  <BookmarkX className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                </div>
              }
              content={<p className="text-sm">Limpar filtros</p>}
            />

            <Tooltip
              trigger={
                <div
                  className={buttonVariants({ variant: "ghost" })}
                  onClick={() => onOpen(true)}
                >
                  <Trash2 className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                </div>
              }
              content={<p className="text-sm">Minha lixeira</p>}
            />
          </div>
        )}
      </QueryState>
    </div>
  );
};
