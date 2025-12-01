import { Layers } from "lucide-react";
import { memo } from "react";

const CountFlashcardsBadgeComponent = ({
  _count,
}: {
  _count: { flashcards: number };
}) => {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/30">
      <Layers className="w-3.5 h-3.5" />
      <span className="text-xs font-bold">{_count.flashcards} cards</span>
    </div>
  );
};

export const CountFlashcardsBadge = memo(CountFlashcardsBadgeComponent);
CountFlashcardsBadge.displayName = "CountFlashcardsBadge";
