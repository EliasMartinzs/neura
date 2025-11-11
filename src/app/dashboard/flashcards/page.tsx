"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useGetFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useFlashcardFiltersStore } from "@/features/flashcard/hooks/use-flashcard-filters-store";
import { Loader2, Plus } from "lucide-react";
import Image from "next/image";
import ErrorImage from "../../../../public/undraw_connection-lost.svg";
import NoDataImage from "../../../../public/undraw_no-data.svg";
import { CreateFlashcardButton } from "./_components/create-flashcard-button";
import { Flashcards } from "./_components/flashcards";
import { FlashcardsFilters } from "./_components/flashcards-filters";

export default function FlashcardPage() {
  const { deck, page, perPage, setPage } = useFlashcardFiltersStore();
  const { data, isLoading, isError, refetch } = useGetFlashcards({
    deck: deck,
    page: page,
    perPage: perPage,
  });

  if (isLoading) {
    return (
      <div className="w-full min-h-[65svh] overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
        <h4 className="text-xl xl:text-2xl">
          <Loader2 className="animate-spin size-7 text-muted-foreground" />
        </h4>
      </div>
    );
  }

  if (isError || !data) {
    <div className="w-full min-h-[65svh] overflow-y-hidden flex items-center justify-center flex-col gap-y-6">
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
      <div className="max-md:space-y-20 max-md:max-w-xs max-sm:h-[70svh] mx-auto">
        <div className="md:fixed w-full h-full flex items-center justify-center flex-col gap-y-6 inset-0 -z-10">
          <Image
            src={NoDataImage}
            alt="deck"
            className="object-center object-contain size-40 lg:h-72"
          />

          <h4 className="text-xl xl:text-2xl text-center">
            Nenhum falshcard criado até o momente, crie um já
          </h4>

          <CreateFlashcardButton
            trigger={
              <Button variant="outline" className="">
                Novo card <Plus className="w-5 h-5 " />
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <Title
        action={
          <CreateFlashcardButton
            trigger={
              <Button variant="outline" className="">
                Novo card <Plus className="w-5 h-5 " />
              </Button>
            }
          />
        }
      >
        Flashcards
      </Title>

      <FlashcardsFilters />

      <Flashcards flashcards={data.data} />

      <PaginationComponent
        page={page}
        totalPages={data.totalPages}
        setPage={setPage}
      />
    </main>
  );
}
