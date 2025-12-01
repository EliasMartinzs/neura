import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { memo, useCallback, useMemo, useState } from "react";
import { ActionsButtons } from "./actions-buttons-deck-card";
import { CountFlashcardsBadge } from "./count-flascard-badge-deck-card";
import { DecorativesAndAnimations } from "./decorative-deck-card";
import { FooterDeckCard } from "./footer-deck-card";
import { HeaderDeckCard } from "./header-deck-card";
import { StatsDeckCard } from "./stats-deck-card";
import { TagsDeckCard } from "./tags-deck-card";
import { getForeground } from "@/constants/circle-colors";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

type Props = {
  deck: Deck;
};

const DeckCardComponent = ({ deck }: Props) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const hasMoreTags = deck.tags.length > 4;

  const displayedTags = useMemo(() => {
    return showAllTags ? deck.tags : deck.tags.slice(0, 4);
  }, [showAllTags, deck.tags]);

  const toggleTags = useCallback(() => {
    setShowAllTags((prev) => !prev);
  }, []);

  const {
    _count,
    color,
    createdAt,
    description,
    difficulty,
    id,
    lastStudiedAt,
    name,
    reviewCount,
    tags,
  } = deck;

  return (
    <div className="relative group h-full">
      <div
        className="absolute -inset-1 opacity-0 hover:opacity-50 rounded-2xl blur-xl group-hover:opacity-75 group-hover:scale-[103px] transition-all duration-500 -z-10"
        style={{
          background:
            deck.color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      ></div>

      <div
        className="relative h-full rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
        style={{
          background:
            color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: getForeground(color || ""),
        }}
      >
        <DecorativesAndAnimations color={color} />

        <ActionsButtons deck={deck} id={id} />

        <CountFlashcardsBadge _count={_count} />

        <HeaderDeckCard description={description} name={name} />

        {/* Main Stats */}
        <div className="relative px-6 py-4">
          <StatsDeckCard
            _count={_count}
            difficulty={difficulty}
            lastStudiedAt={lastStudiedAt}
            reviewCount={reviewCount}
            color={color}
          />
        </div>

        <TagsDeckCard
          displayedTags={displayedTags}
          hasMoreTags={hasMoreTags}
          toggleTags={toggleTags}
          showAllTags={showAllTags}
          tags={tags}
        />

        <FooterDeckCard createdAt={createdAt} id={deck.id} />

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white to-transparent opacity-40"></div>
      </div>
    </div>
  );
};

export const DeckCard = memo(DeckCardComponent);
DeckCard.displayName = "DeckCard";
