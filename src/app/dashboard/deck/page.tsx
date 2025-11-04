"use client";

import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useGetDecks } from "@/features/deck/api/use-get-decks";
import { useDeckFiltersStore } from "@/features/deck/store/deck-filters-store";
import Image from "next/image";
import ErrorImage from "../../../../public/undraw_connection-lost.svg";
import LoadingImage from "../../../../public/undraw_loading.svg";
import NoDataImage from "../../../../public/undraw_no-data.svg";
import { CreateDeckButton } from "./_components/create-deck-button";
import { DeckFilters } from "./_components/deck-filters";
import { Decks } from "./_components/decks";
import { PaginationDeck } from "./_components/pagination-deck";

export default function DeckPage() {
  const { tags, page, perPage, setPage, setPerPage } = useDeckFiltersStore();

  const { data, isLoading, isError, refetch } = useGetDecks({
    page,
    perPage,
    tags: tags.length > 0 ? tags : undefined,
  });

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

        <h4 className="text-xl xl:text-2xl">Carregando...</h4>
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

      <h4 className="text-xl xl:text-2xl">
        Houve um erro,{" "}
        <Button onClick={() => refetch()}>Tente novamente</Button>
      </h4>
    </div>;
  }

  if (!data?.data?.length) {
    return (
      <div className="w-full min-h-[65svh]">
        <DeckFilters setPerPage={setPerPage} perPage={perPage} />

        <div className="flex-1 flex items-center justify-center flex-col gap-y-20 mt-20">
          <Image
            src={NoDataImage}
            alt="deck"
            width={380}
            height={380}
            className="object-center object-contain"
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

      <DeckFilters setPerPage={setPerPage} perPage={perPage} />

      <Decks decks={data?.data} />

      <PaginationDeck
        page={page}
        totalPages={data.totalPages}
        setPage={setPage}
      />
    </main>
  );
}
