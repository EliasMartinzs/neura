"use client";

import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { useDeckFiltersStore } from "@/features/deck/store/use-deck-filters-store";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import ErrorImage from "../../../../public/undraw_connection-lost.svg";
import NoDataImage from "../../../../public/undraw_no-data.svg";
import { CreateDeckButton } from "./_components/create-deck-button";
import { DeckFilters } from "./_components/deck-filters";
import { Decks } from "./_components/decks";
import { PaginationComponent } from "@/components/shared/pagination-component";
import { cn } from "@/lib/utils";

export default function DeckPage() {
  const { tags, page, perPage, setPage, setPerPage } = useDeckFiltersStore();

  const { data, isLoading, isError, refetch } = useGetDecks({
    page,
    perPage,
    tags: tags.length > 0 ? tags : undefined,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-svh overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
        <h4 className="text-xl xl:text-2xl">
          <Loader2 className="animate-spin size-7 text-muted-foreground" />
        </h4>
      </div>
    );
  }

  if (isError || !data) {
    <div className="w-full min-h-svh overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
      <Image
        src={ErrorImage}
        alt="error"
        className="object-center object-contain size-40 lg:h-72"
      />

      <h4 className="text-xl xl:text-2xl">
        Houve um erro,{" "}
        <Button onClick={() => refetch()}>Tente novamente</Button>
      </h4>
    </div>;
  }

  if (!data?.data?.length) {
    return (
      <div
        className={cn(
          "max-md:space-y-20 max-md:max-w-xs max-sm:h-[70svh] mx-auto"
        )}
      >
        <DeckFilters />

        <div className="md:fixed w-full h-full flex items-center justify-center flex-col gap-y-6 inset-0 -z-50">
          <Image
            src={NoDataImage}
            alt="deck"
            width={380}
            height={380}
            className="object-center object-contain size-40 lg:h-72"
          />

          <h4 className="text-xl xl:text-2xl text-center">
            Nenhum Deck criado até o momente, crie um já
          </h4>

          <CreateDeckButton />
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <Title action={<CreateDeckButton />}>Meus decks</Title>

      <DeckFilters />

      <Decks decks={data?.data} />

      <PaginationComponent
        page={page}
        totalPages={data.totalPages}
        setPage={setPage}
      />
    </main>
  );
}
