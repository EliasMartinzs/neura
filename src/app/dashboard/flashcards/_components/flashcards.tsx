import { ResponseFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { FlashcardItem } from "./flashcard-item";
import { EmptyState } from "@/lib/query/empty-state";

type Flashcards = NonNullable<ResponseFlashcards>["data"];

type Props = {
  flashcards: Flashcards;
};

export const Flashcards = ({ flashcards }: Props) => {
  if (!flashcards?.length) {
    return (
      <>
        <EmptyState />
      </>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-6">
      {flashcards?.map((flashcard) => (
        <div className="relative isolate" key={flashcard.id}>
          <FlashcardItem flashcard={flashcard} />
        </div>
      ))}
    </section>
  );
};
