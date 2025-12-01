import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getForeground } from "@/constants/circle-colors";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { Ellipsis, Info } from "lucide-react";
import Link from "next/link";
import { EditDeckButton } from "./edit-deck-button";
import { MoveTrashButton } from "./move-trash-button";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

export const ActionsButtons = ({ deck, id }: { deck: Deck; id: string }) => {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
      <Popover>
        <PopoverTrigger>
          <Ellipsis
            className="size-5"
            style={{ color: getForeground(deck.color || "") }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <EditDeckButton deck={deck} />

          <MoveTrashButton id={id} />

          <Link
            href={`/dashboard/deck/${id}`}
            className="flex items-center gap-x-3 hover:bg-accent w-full p-3 rounded-xl"
          >
            <Info className="w-5 h-5 " /> Info
          </Link>
        </PopoverContent>
      </Popover>
    </div>
  );
};
