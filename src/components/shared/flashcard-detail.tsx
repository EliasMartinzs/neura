import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResponseFlashcard } from "@/features/flashcard/api/use-get-flashcard";
import { cn } from "@/lib/utils";
import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import { Award, BookOpen, Info, RotateCw, Target } from "lucide-react";

import { useHelperFlashcard } from "@/hooks/use-helper-flashcard";
import { motion } from "framer-motion";

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export const FlashcardDetail = ({
  flashcard,
  showDiff = true,
  isFlipped,
  setIsFlipped,
}: {
  flashcard: Flashcard;
  showDiff?: boolean;
  setIsFlipped: (prev: boolean) => void;
  isFlipped: boolean;
}) => {
  const { bloomLevelConfig, difficultyConfig } = useHelperFlashcard(flashcard);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const difficulty =
    difficultyConfig[flashcard?.difficulty as FlashcardDifficulty];
  const bloomLevel = bloomLevelConfig[flashcard?.bloomLevel as BloomLevel];

  const bg = `linear-gradient(to bottom right, ${
    flashcard?.color ?? "#7c3aed"
  }, ${flashcard?.color ?? "#7c3aed"}99, ${flashcard?.color ?? "#7c3aed"}cc)`;

  return (
    <div className="w-full space-y-6">
      {/* Flashcard */}
      <div
        className="relative cursor-pointer group"
        style={{ perspective: "1000px" }}
        onClick={handleFlip}
        aria-pressed={isFlipped}
      >
        <motion.div
          className="relative w-full"
          style={{ transformStyle: "preserve-3d", height: "500px" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          initial={false}
        >
          <>
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full z-99"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/10 rounded-tl-full z-99"></div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-99">
              <div
                className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
                style={{ animationDelay: "0s", animationDuration: "3s" }}
              ></div>
              <div
                className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
                style={{ animationDelay: "1s", animationDuration: "3s" }}
              ></div>
              <div
                className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"
                style={{ animationDelay: "2s", animationDuration: "3s" }}
              ></div>
            </div>
          </>

          {/* Front */}
          <Card
            className="absolute top-0 left-0 w-full h-full"
            style={{
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              background: bg,
            }}
          >
            <div className="relative flex flex-col justify-center h-full p-4 md:p-8 lg:p-12 gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`${difficulty.bg} ${difficulty.text} border ${difficulty.border} px-3 py-1`}
                  >
                    <span className="mr-1">{difficulty.icon}</span>
                    {difficulty.label}
                  </Badge>

                  <Badge
                    className="px-3 py-1 backdrop-blur-sm"
                    variant={"secondary"}
                  >
                    <span className="mr-1">{bloomLevel.icon}</span>
                    {bloomLevel.label}
                  </Badge>
                </div>
                <div className="w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center">
                  <RotateCw className="w-5 h-5  group-hover:rotate-180 transition-transform duration-500" />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center px-4">
                <div className="space-y-4 text-center">
                  <div className="inline-block px-4 py-2 rounded-full">
                    <span className="font-semibold">Pergunta</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">
                    {flashcard?.front}
                  </h2>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Clique para revelar
                </span>
                <span className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  {difficulty.description}
                </span>
              </div>
            </div>
          </Card>

          {/* Back */}
          <Card
            className="absolute top-0 left-0 w-full h-full"
            style={{
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: bg,
            }}
          >
            <div className="relative h-[400px] md:h-[500px] p-8 md:p-12 flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-1" />

              <div className="flex items-start justify-between gap-4 mb-6">
                <Badge className="px-3 py-1" variant={"outline"}>
                  <Award className="w-4 h-4 mr-1" />
                  Resposta
                </Badge>
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <RotateCw className="w-5 h-5 " />
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center px-4">
                <h2 className="text-xl md:text-3xl font-semibold  leading-relaxed text-center">
                  {flashcard?.back}
                </h2>
              </div>

              {flashcard?.note && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <p className="text-sm /80 flex items-start gap-2">
                    <BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      <strong>Nota:</strong> {flashcard?.note}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {showDiff && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(difficultyConfig).map(([key, value]) => (
            <Button
              variant={"outline"}
              key={key}
              className={cn(flashcard?.difficulty === key && value.bg)}
              disabled={flashcard?.difficulty !== key}
            >
              <span>{value.icon}</span> {value.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
