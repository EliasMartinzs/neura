"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResponseFlashcard,
  useGetFlashcard,
} from "@/features/flashcard/api/use-get-flashcard";
import { cn } from "@/lib/utils";
import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Info,
  Layers,
  Loader2,
  RotateCw,
  Star,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useHelperFlashcard } from "@/hooks/use-helper-flashcard";
import Image from "next/image";
import NoDataImage from "../../../../../public/undraw_no-data.svg";

import { motion } from "framer-motion";
import Link from "next/link";

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export default function Flashcard() {
  const { id } = useParams<{ id: string }>();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const { data, isLoading, isError, refetch, isRefetching } =
    useGetFlashcard(id);

  if (isLoading) {
    return (
      <div className="w-full h-svh overflow-hidden flex items-center justify-center absolute top-0 left-0">
        <Loader2 className="animate-spin size-7" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-svh overflow-hidden flex items-center justify-center flex-col absolute top-0 left-0">
        <p>Houve um error ao buscar seus dados, tente novamente</p>

        <Button
          variant={"outline"}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? <Loader2 className="animate-spin" /> : "Recarregar"}
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="w-full h-svh overflow-hidden flex items-center justify-center flex-col absolute top-0 left-0 gap-y-6">
        <Image
          src={NoDataImage}
          alt="no data"
          className="object-cover size-64"
        />

        <p>
          Nenhuma informação sobre este flashcard foi encontrada, tente
          novamente
        </p>

        <Button
          variant={"outline"}
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          {isRefetching ? <Loader2 className="animate-spin" /> : "Recarregar"}
        </Button>
      </div>
    );
  }

  const flashcard = data?.data;

  const {
    bloomLevelConfig,
    difficultyConfig,
    formatDate,
    getEaseFactorInfo,
    getPerformanceInfo,
  } = useHelperFlashcard(flashcard);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const difficulty =
    difficultyConfig[flashcard.difficulty as FlashcardDifficulty];
  const bloomLevel = bloomLevelConfig[flashcard.bloomLevel as BloomLevel];
  const easeInfo = getEaseFactorInfo(flashcard.easeFactor);
  const performanceInfo = getPerformanceInfo(
    flashcard.performanceAvg as number
  );
  const nextReviewDate = formatDate(flashcard.nextReview);
  const lastReviewDate = formatDate(flashcard.lastReviewedAt);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <Breadcrumb />
        {/* Header Info Bar */}
        <HeaderCard
          topic={flashcard.topic}
          subtopic={flashcard.subtopic}
          setShowStats={setShowStats}
          showStats={showStats}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Flashcard Column */}
          <FlashcardCard
            bloomLevel={bloomLevel}
            difficulty={difficulty}
            difficultyConfig={difficultyConfig}
            flashcard={flashcard}
            handleFlip={handleFlip}
            isFlipped={isFlipped}
          />

          {/* Stats Sidebar */}
          {showStats && (
            <div className="space-y-4">
              {/* Performance Card */}
              <PerformanceCard
                performanceAvg={flashcard.performanceAvg}
                performanceInfo={performanceInfo}
              />

              {/* Ease Factor Card */}
              <EaseFactorCard
                easeFactor={flashcard.easeFactor}
                easeInfo={easeInfo}
              />

              {/* Review Schedule */}
              <ReviewScheduleCard
                interval={flashcard.interval}
                repetition={flashcard.repetition}
                lastReviewDate={lastReviewDate}
                nextReviewDate={nextReviewDate}
              />

              {/* Bloom Level Info */}
              <BloomLevelCard bloomLevel={bloomLevel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Breadcrumb = () => {
  return (
    <Link
      href="/dashboard/flashcards"
      className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5 w-fit"
    >
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
      <span className="font-medium">Voltar para flashcards</span>
    </Link>
  );
};

const HeaderCard = ({
  setShowStats,
  showStats,
  subtopic,
  topic,
}: {
  topic: string | null;
  subtopic: string | null;
  setShowStats: (prev: boolean) => void;
  showStats: boolean;
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5" />
          {topic ? (
            <h1 className="text-2xl font-bold">{topic}</h1>
          ) : (
            "Nenhum tópico"
          )}
        </div>
        <p className="text-sm flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          {subtopic ? subtopic : "Nenhum subtópico"}
        </p>
      </div>

      <Button variant="icon" onClick={() => setShowStats(!showStats)}>
        {showStats ? (
          <EyeOff className="w-4 h-4 mr-2" />
        ) : (
          <Eye className="w-4 h-4 mr-2" />
        )}
        {showStats ? "Ocultar" : "Mostrar"} Estatísticas
      </Button>
    </div>
  );
};

const FlashcardCard = ({
  handleFlip,
  flashcard,
  isFlipped,
  difficulty,
  bloomLevel,
  difficultyConfig,
}: {
  flashcard: Flashcard;
  handleFlip: () => void;
  isFlipped: boolean;
  difficulty: {
    bg: string;
    text: string;
    border: string;
    label: string;
    icon: string;
    description: string;
  };
  bloomLevel: {
    label: string;
    icon: string;
    description: string;
  };
  difficultyConfig: Record<
    FlashcardDifficulty,
    {
      bg: string;
      text: string;
      border: string;
      label: string;
      icon: string;
      description: string;
    }
  >;
}) => {
  const bg = `linear-gradient(to bottom right, ${
    flashcard?.color ?? "#7c3aed"
  }, ${flashcard?.color ?? "#7c3aed"}99, ${flashcard?.color ?? "#7c3aed"}cc)`;

  return (
    <div className="lg:col-span-2 space-y-6">
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

      {/* Action Buttons */}
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
    </div>
  );
};

const PerformanceCard = ({
  performanceInfo,
  performanceAvg,
}: {
  performanceInfo: {
    label: string;
    color: string;
    bg: string;
  };
  performanceAvg: number | null;
}) => {
  return (
    <Card className="backdrop-blur-sm overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Desempenho
          </h3>
          <span className={`text-sm font-medium ${performanceInfo.color}`}>
            {performanceInfo.label}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold ">{performanceAvg}%</span>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full ${performanceInfo.bg} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${performanceAvg}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Média de acertos nas últimas revisões
          </p>
        </div>
      </div>
    </Card>
  );
};

const EaseFactorCard = ({
  easeInfo,
  easeFactor,
}: {
  easeInfo: {
    label: string;
    color: string;
    icon: string;
  };
  easeFactor: number;
}) => {
  return (
    <Card className="backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Facilidade
          </h3>
          <span className="text-2xl">{easeInfo.icon}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold ">{easeFactor}</span>
            <span className="text-lg text-muted-foreground mb-1">/4.0</span>
          </div>
          <Badge className={`${easeInfo.color} bg-white/10 border-0`}>
            {easeInfo.label}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Indica como você retém este conteúdo. Maior = mais fácil de lembrar.
          </p>
        </div>
      </div>
    </Card>
  );
};

const ReviewScheduleCard = ({
  interval,
  lastReviewDate,
  nextReviewDate,
  repetition,
}: {
  lastReviewDate: {
    text: string;
    relative: string;
  };
  nextReviewDate: {
    text: string;
    relative: string;
  };
  interval: number;
  repetition: number;
}) => {
  return (
    <Card className="backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Cronograma
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border-primary border">
            <Clock className="w-5 h-5 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium ">Última Revisão</p>
              <p className="text-xs truncate">{lastReviewDate.text}</p>
              {lastReviewDate.relative && (
                <Badge className="mt-1 border-0 text-xs">
                  {lastReviewDate.relative}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 text-primary-foreground bg-linear-to-br from-primary via-primary/70 to-primary/40 backdrop-blur-sm rounded-lg">
            <Zap className="w-5 h-5 text-primary-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Próxima Revisão</p>
              <p className="text-xs truncate">{nextReviewDate.text}</p>
              {nextReviewDate.relative && (
                <Badge className="mt-1 border text-primary bg-primary-foreground text-xs">
                  {nextReviewDate.relative}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-sm text-muted-foreground">Intervalo</span>
            <span className="text-lg font-bold ">{interval} dias</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-sm text-muted-foreground">Repetições</span>
            <span className="text-lg font-bold ">{repetition}x</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BloomLevelCard = ({
  bloomLevel,
}: {
  bloomLevel: {
    label: string;
    icon: string;
    description: string;
  };
}) => {
  return (
    <Card className="bg-linear-to-br from-primary via-primary/60 to-primary/80 text-primary-foreground backdrop-blur-sm">
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bloomLevel.icon}</span>
          <div>
            <h3 className="text-sm font-semibold ">{bloomLevel.label}</h3>
            <p className="text-xs">{bloomLevel.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
