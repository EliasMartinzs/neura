"use client";

import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { DeckCard } from "./deck-card";

type Deck = NonNullable<ResponseGetDecks>["data"];

export const Decks = ({ decks }: { decks: Deck | null | undefined }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {decks?.map((deck) => (
        <DeckCard deck={deck} key={deck.id} />
      ))}
    </section>
  );
};
