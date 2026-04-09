"use client";

import { Title } from "@/components/shared/title";
import { useDashboard } from "@/features/session/api/use-dashboard";
import { StudiedCategory } from "@/utils/type";
import { Loader2 } from "lucide-react";
import { AccuracyWidget } from "./_components/accuracy-widget";
import { BloomLevelWidget } from "./_components/bloom-level-widget";
import { StatsWidget } from "./_components/stats-widget";
import { TodayReviewWidget } from "./_components/today-review-widget";
import { TopTagsWidget } from "./_components/top-tags-widget";

type BloomStatus = {
  level: string;
  count: number;
};

export default function DashboardPage() {
  const { isLoading, isError, data, refetch, isFetching } = useDashboard();

  const stats = data?.data?.stats;

  const userStats = {
    decksCount: stats?.decksCount || 0,
    flashcardsCreated: stats?.flashcardsCreated || 0,
    studiesCompleted: stats?.studiesCompleted || 0,
    totalReviews: stats?.totalReviews || 0,
    lastStudyAt: stats?.lastStudyAt,
  };

  const accuracyWidget = {
    accuracyRateCards: stats?.accuracyRateCards || 0,
    totalCorrectAnswers: stats?.totalCorrectAnswers || 0,
    totalWrongAnswers: stats?.totalWrongAnswers || 0,
  };

  const todayReviewWidget = data?.data?.cardsReviewToday ?? [];
  const topTagsWidget = stats?.mostStudiedCategories as StudiedCategory[];
  const bloomLevel = stats?.mostStudiedBloomLevel as BloomStatus[];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin size-7 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar os dados.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 relative z-10">
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <Loader2 className="animate-spin size-5 text-muted-foreground" />
        </div>
      )}

      <div className="space-y-6">
        <div>
          <Title>Suas Estatísticas</Title>
          <p className="font-light">Acompanhe seu progresso e conquistas</p>
        </div>
        <StatsWidget userStats={userStats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AccuracyWidget accuracyWidget={accuracyWidget} />
        <TodayReviewWidget flashcards={todayReviewWidget} />
        <BloomLevelWidget bloomData={bloomLevel} />
        <TopTagsWidget topTags={topTagsWidget} />
      </div>
    </div>
  );
}
