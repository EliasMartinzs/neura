"use client";

import { Button } from "@/components/ui/button";
import { useDashboard } from "@/features/session/api/use-dashboard";
import { normalizeTags } from "@/lib/utils";
import { StudiedCategory } from "@/utils/type";
import { Loader2, RotateCcw } from "lucide-react";
import Image from "next/image";
import ErrorImage from "../../../public/server-error-dark.svg";
import NoData from "../../../public/undraw_no-data.svg";
import { AccuracyWidget } from "./_components/accuracy-widget";
import { BloomLevelWidget } from "./_components/bloom-level-widget";
import { TodayReviewsWidget } from "./_components/today-review-widget";
import { TopTagsWidget } from "./_components/top-tags-widget";
import { UserStatsWidget } from "./_components/user-stats-widget";

type BloomStatus = {
  level: string;
  count: number;
};

export default function DashboardPage() {
  const { data, isLoading, isError, isRefetching, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="w-full h-svh absolute top-0 left-0 flex items-center justify-center z-50">
        <Loader2 className="animate-spin size-8 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-svh absolute top-0 left-0 flex flex-col gap-y-8 items-center justify-center z-50">
        <Image
          src={ErrorImage}
          alt="erro image"
          className="object-center object-cover size-40"
        />

        <p className="text-muted-foreground text-lg">
          Houve um erro ao buscar seus dados, Tente novamente.
        </p>

        <Button
          variant={"icon"}
          disabled={isRefetching}
          onClick={() => refetch()}
        >
          {isRefetching ? (
            <>
              Recarregarando... <RotateCcw className="size-5 animate-spin" />
            </>
          ) : (
            <>
              Recarregar <RotateCcw className="size-5" />
            </>
          )}
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="w-full h-svh absolute top-0 left-0 flex flex-col gap-y-8 items-center justify-center -z-50">
        <Image
          src={NoData}
          alt="no data"
          className="object-center object-cover size-40"
        />

        <div className="max-sm:max-w-sm mx-auto text-center space-y-4">
          <h4 className="text-3xl">Seu progresso começa agora</h4>

          <p className="text-muted-foreground">
            Você ainda não tem dados suficientes. Explore o app, responda alguns
            cards e voltamos aqui para te mostrar sua evolução em tempo real.
          </p>
        </div>
      </div>
    );
  }

  const { cardsReviewToday, stats } = data.data;

  return (
    <div className="w-full space-y-2 lg:space-y-4">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Suas Estatísticas</h1>
          <p className="text-lg">Acompanhe seu progresso e conquistas</p>
        </div>
        <UserStatsWidget
          userStats={{
            decksCount: stats?.decksCount || 0,
            flashcardsCreated: stats?.flashcardsCreated || 0,
            studiesCompleted: stats?.studiesCompleted || 0,
            totalReviews: stats?.totalReviews || 0,
            lastStudyAt: stats?.lastStudyAt,
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 xl:col-span-4">
          <AccuracyWidget
            accuracyRateCards={stats?.accuracyRateCards || 0}
            totalCorrectAnswers={stats?.totalCorrectAnswers || 0}
            totalWrongAnswers={stats?.totalWrongAnswers || 0}
          />
        </div>

        <div className="lg:col-span-6 xl:col-span-3">
          <TodayReviewsWidget flashcards={cardsReviewToday} />
        </div>

        <div className="lg:col-span-12 xl:col-span-5">
          <TopTagsWidget
            topTags={normalizeTags(
              (stats?.mostStudiedCategories ?? []) as StudiedCategory[]
            )}
          />
        </div>

        <div className="lg:col-span-12">
          <BloomLevelWidget
            bloomData={
              data?.data?.stats?.mostStudiedBloomLevel as BloomStatus[]
            }
          />
        </div>
      </div>
    </div>
  );
}
