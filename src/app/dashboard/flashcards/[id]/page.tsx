"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ResponseFlashcard,
  useGetFlashcard,
} from "@/features/flashcard/api/use-get-flashcard";
import {
  ArrowLeft,
  Brain,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  EyeOff,
  Layers,
  Loader2,
  LucideIcon,
  LucideProps,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useHelperFlashcard } from "@/hooks/use-helper-flashcard";
import Image from "next/image";
import NoDataImage from "../../../../../public/undraw_no-data.svg";

import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { BloomLevel } from "@prisma/client";
import Link from "next/link";
import { DeleteFlashcardButton } from "../_components/delete-flashcard-button";

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export default function Flashcard() {
  const { id } = useParams<{ id: string }>();
  const [showStats, setShowStats] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

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
      <div className="w-full h-svh overflow-hidden flex items-center justify-center flex-col absolute top-0 left-0 gap-y-6 -z-50">
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
    getEaseFactorInfo,
    getPerformanceInfo,
    formatDate,
    bloomLevelConfig,
  } = useHelperFlashcard(flashcard);

  const bloomLevel = bloomLevelConfig[flashcard?.bloomLevel as BloomLevel];
  const easeInfo = getEaseFactorInfo(flashcard?.easeFactor as number);
  const performanceInfo = getPerformanceInfo(
    flashcard?.performanceAvg as number
  );
  const nextReviewDate = formatDate(flashcard?.nextReview);
  const lastReviewDate = formatDate(flashcard?.lastReviewedAt);

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
          id={id}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Flashcard Column */}
          <div className="lg:col-span-2">
            <FlashcardDetail
              flashcard={flashcard}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />
          </div>

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
  id,
}: {
  topic: string | null;
  subtopic: string | null;
  setShowStats: (prev: boolean) => void;
  showStats: boolean;
  id: string;
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

      <div className="space-x-3">
        <Button variant="icon" onClick={() => setShowStats(!showStats)}>
          {showStats ? (
            <EyeOff className="w-4 h-4 mr-2" />
          ) : (
            <Eye className="w-4 h-4 mr-2" />
          )}
          {showStats ? "Ocultar" : "Mostrar"} Estatísticas
        </Button>

        <DeleteFlashcardButton color={""} id={id} />
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
    icon: LucideIcon;
  };
  easeFactor: number;
}) => {
  const Icon = easeInfo.icon;
  return (
    <Card className="backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Facilidade
          </h3>
          <span className="text-2xl">
            <Icon />
          </span>
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

          <div className="flex items-start gap-3 p-3 text-white bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-lg">
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
    <Card className="bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white backdrop-blur-sm">
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
