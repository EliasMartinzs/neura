"use client";

import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { DeckCard } from "./deck-card";

type Deck = NonNullable<ResponseGetDecks>["data"];

export const Decks = ({ decks }: { decks: Deck | null | undefined }) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 p-6">
      {decks?.map((deck) => (
        <div className="relative isolate" key={deck.id}>
          <DeckCard deck={deck} />
        </div>
      ))}
    </section>
  );
};
