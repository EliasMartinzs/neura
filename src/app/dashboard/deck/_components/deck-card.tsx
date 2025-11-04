import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { circleColors, getForeground } from "@/constants/circle-colors";
import { DIFFICULTY } from "@/constants/difficulty";
import client from "@/lib/hc";
import { cn } from "@/lib/utils";
import { InferResponseType } from "hono";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { MoveTrashButton } from "./move-trash-button";
import { EditDeckButton } from "./edit-deck-button";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";

type Deck = NonNullable<NonNullable<ResponseGetDecks>["data"]>[number];

type Props = {
  deck: Deck;
};

export const DeckCard = ({ deck }: Props) => {
  const [showAllTags, setShowAllTags] = useState(4);

  const { _count, color, createdAt, description, difficulty, id, name, tags } =
    deck;

  const shouldShowToggle = tags.length > 4;
  const isShowingAll = showAllTags >= tags.length;

  return (
    <Card
      style={{
        background: color || "",
        color: getForeground(color || ""),
      }}
      className={cn(
        "rounded-xl shadow transition-all relative flex justify-center"
      )}
      key={id}
    >
      <CardHeader>
        <CardTitle className="text-center text-2xl mx-7 lg:mx-10 capitalize">
          {name}
        </CardTitle>
        {description && (
          <CardDescription className="text-xl leading-7 font-extralight text-center opacity-75">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex items-center justify-center gap-x-3">
        <Image
          src={
            circleColors.find((c) => c.background === color)?.foreground ===
            "#fff"
              ? "/icons/flash-card-dark.png"
              : "/icons/flash-card-light.png"
          }
          alt=""
          width={48}
          height={48}
        />
        {_count.flashcards === 0
          ? "Nenhum flash card no momento"
          : _count.flashcards}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        {difficulty && (
          <div className="flex items-center justify-center w-full gap-x-3 text-lg">
            <Image
              src={
                circleColors.find((c) => c.background === color)?.foreground ===
                "#fff"
                  ? "/icons/speedometer-dark.png"
                  : "/icons/speedometer-light.png"
              }
              alt=""
              width={48}
              height={48}
            />
            {DIFFICULTY[difficulty]}
          </div>
        )}

        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap items-center gap-4">
            {tags.length >= 1 &&
              tags.slice(0, showAllTags).map((tag) => (
                <div
                  key={tag}
                  className={cn("border p-2 rounded-sm text-lg")}
                  style={{
                    borderColor: getForeground(color || ""),
                  }}
                >
                  {tag}
                </div>
              ))}

            {shouldShowToggle && (
              <Button
                variant="ghost"
                className="border p-2 rounded-sm text-lg flex items-center gap-x-3"
                style={{ borderColor: getForeground(color || "") }}
                onClick={() => setShowAllTags(isShowingAll ? 4 : tags.length)}
              >
                {isShowingAll ? (
                  <>
                    <EyeOff className="size-5" />
                    Ocultar tags
                  </>
                ) : (
                  <>
                    <Eye className="size-5" />
                    Todas tags
                  </>
                )}
              </Button>
            )}
          </div>
          <span>
            {Intl.DateTimeFormat("pt-BR").format(new Date(createdAt))}
          </span>
        </div>
      </CardFooter>

      <div className="absolute top-3 right-3 flex items-center gap-x-3">
        <EditDeckButton deck={deck} />
        <MoveTrashButton id={deck.id} textColor={getForeground(color || "")} />
      </div>
    </Card>
  );
};
