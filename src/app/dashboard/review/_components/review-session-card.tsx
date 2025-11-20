import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { ReviewCardForm } from "@/components/shared/review-card-form";
import { ResponseUseGetReviews } from "@/features/study/api/use-get-reviews";
import { cn } from "@/lib/utils";
import { AlertCircle, Flame } from "lucide-react";
import { useMemo, useState } from "react";

type Flashcard = NonNullable<ResponseUseGetReviews["data"]>["today"][number];

type Props = {
  today: Flashcard[] | undefined;
  urgent: Flashcard[] | undefined;
};

export const ReviewSessionCard = ({ today, urgent }: Props) => {
  const [selected, setSelected] = useState<"urgent" | "today">("today");
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const columns = useMemo(
    () => [
      {
        id: "urgent",
        title: "Urgente",
        subtitle: "Revisar agora",
        icon: AlertCircle,
        count: urgent?.length || 0,
        cards: urgent,
        gradient: "from-red-500 via-rose-500 to-pink-500",
        bgGradient: "from-red-500/70 to-pink-500/70",
        glowColor: "rgba(239, 68, 68, 0.3)",
        iconColor: "text-red-200",
        countBg: "bg-red-500/70",
        countBorder: "border-red-500/30",
        countText: "text-white",
        selected: selected === "urgent",
      },
      {
        id: "today",
        title: "Hoje",
        subtitle: "Programado para hoje",
        icon: Flame,
        count: today?.length || 0,
        cards: today,
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        bgGradient: "from-orange-500/70 to-yellow-500/70",
        glowColor: "rgba(249, 115, 22, 0.3)",
        iconColor: "text-orange-200",
        countBg: "bg-orange-500/70",
        countBorder: "border-orange-500/30",
        countText: "text-white",
        selected: selected === "today",
      },
    ],
    [today, urgent, selected]
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-x-4">
        {columns.map((column) => {
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className={cn(
                "max-sm:flex-1 md:min-w-lg",
                !column.selected && "opacity-80"
              )}
              onClick={() => {
                setSelected((prevState) =>
                  prevState === "today" ? "urgent" : "today"
                );
              }}
            >
              <div className="sticky top-0 z-10 mb-4">
                <div
                  className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${column.bgGradient} border border-slate-700/50 backdrop-blur-xl p-4`}
                >
                  <div
                    className="absolute inset-0 opacity-20 blur-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${column.glowColor}, transparent)`,
                    }}
                  />

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl bg-slate-900/50 ${column.iconColor}`}
                      >
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{column.title}</h3>
                        <p className="text-muted-foreground text-xs">
                          {column.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Contador */}
                    <div
                      className={`${column.countBg} ${column.countBorder} border backdrop-blur-sm rounded-xl px-3 py-2 min-w-[60px] text-center`}
                    >
                      <div
                        className={`text-2xl font-extrabold ${column.countText}`}
                      >
                        {column.count}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progresso decorativa */}
                  <div className="mt-3 h-1 bg-slate-900/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-linear-to-r ${column.gradient} transition-all duration-1000`}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {columns.map((column) => {
        if (!column.selected) return null;

        const cards = column.cards || [];
        if (!cards.length) {
          return (
            <div key={column.id} className="text-center mt-10">
              Nenhuma revisão pendente!
            </div>
          );
        }

        const currentCardIndex = Math.min(currentIndex, cards.length - 1);
        const card = cards[currentCardIndex];

        const bg = `linear-gradient(to bottom right, ${
          card.color ?? "#7c3aed"
        }, ${card.color ?? "#7c3aed"}99, ${card.color ?? "#7c3aed"}cc)`;

        const nextCard = () => {
          setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
        };

        return (
          <div key={column.id} className="max-w-6xl mx-auto space-y-8">
            <FlashcardDetail
              flashcard={card}
              showDiff={false}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
              key={card.id}
            />

            {isFlipped && (
              <ReviewCardForm
                sessionId={card.sessionId ?? ""}
                flashcardId={card.id}
                bg={bg}
                setIsFlipped={setIsFlipped}
                nextCard={nextCard}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
