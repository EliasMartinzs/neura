import { ResponseFlashcards } from "@/features/flashcard/api/use-get-flashcards";
import { useRouter } from "next/navigation";

import { getForeground } from "@/constants/circle-colors";

import { ActionsButtonsFlashcard } from "./actions-buttons-flashcard";
import { DecorativesAndAnimations } from "./decorative-flashcard";
import { FooterFlashcard } from "./footer-flashcard";
import { HeaderFrontFlashcard } from "./header-front-flashcard";
import { MainStatsFlashcard } from "./main-stats-flashcard";
import { memo } from "react";

type Flashcard = NonNullable<NonNullable<ResponseFlashcards>["data"]>[number];

type Props = {
  flashcard: Flashcard;
};

const FlashcardItemComponent = ({ flashcard }: Props) => {
  const router = useRouter();

  const {
    id,
    front,
    color,
    difficulty,
    createdAt,
    deck,
    _count,
    performanceAvg,
    repetition,
  } = flashcard;

  return (
    <div className="relative group w-auto h-full">
      <DecorativesAndAnimations color={flashcard.color} />

      <div
        className="relative rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full"
        style={{
          background:
            color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: getForeground(color || ""),
        }}
      >
        <ActionsButtonsFlashcard color={color} id={id} router={router} />

        <HeaderFrontFlashcard color={color} front={front} />

        <div className="relative px-6 py-4">
          <MainStatsFlashcard
            _count={_count}
            difficulty={difficulty}
            performanceAvg={performanceAvg}
            repetition={repetition}
          />
        </div>

        <FooterFlashcard createdAt={createdAt} name={deck?.name} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white to-transparent opacity-40"></div>
    </div>
  );
};

export const FlashcardItem = memo(FlashcardItemComponent);
FlashcardItem.displayName = "FlashcardItem";
