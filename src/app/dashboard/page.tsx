"use client";

import { useDashboard } from "@/features/session/api/use-dashboard";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { StudiedCategory } from "@/utils/type";
import { useMemo } from "react";
import { AccuracyWidget } from "./_components/accuracy-widget";
import { BloomLevelWidget } from "./_components/bloom-level-widget";
import { StatsWidget } from "./_components/stats-widget";
import { TodayReviewWidget } from "./_components/today-review-widget";
import { TopTagsWidget } from "./_components/top-tags-widget";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";

type BloomStatus = {
  level: string;
  count: number;
};

export default function DashboardPage() {
  const query = useDashboard();

  return (
    <div className="w-full space-y-2 lg:space-y-4">
      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        empty={<EmptyState />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => {
          const userStats = useMemo(() => {
            const s = data?.data?.stats;
            return {
              decksCount: s?.decksCount || 0,
              flashcardsCreated: s?.flashcardsCreated || 0,
              studiesCompleted: s?.studiesCompleted || 0,
              totalReviews: s?.totalReviews || 0,
              lastStudyAt: s?.lastStudyAt,
            };
          }, [data?.data?.stats]);

          const accuracyWidget = useMemo(() => {
            const a = data?.data?.stats;
            return {
              accuracyRateCards: a?.accuracyRateCards || 0,
              totalCorrectAnswers: a?.totalCorrectAnswers || 0,
              totalWrongAnswers: a?.totalWrongAnswers || 0,
            };
          }, [data?.data?.stats]);

          const todayReviewWidget = useMemo(
            () => data?.data?.cardsReviewToday ?? [],
            [data?.data?.cardsReviewToday]
          );

          const topTagsWidget = useMemo(
            () => data?.data?.stats?.mostStudiedCategories as StudiedCategory[],
            [data?.data?.stats?.mostStudiedCategories]
          );

          const bloomLevel = useMemo(
            () => data?.data?.stats?.mostStudiedBloomLevel as BloomStatus[],
            [data?.data?.stats?.mostStudiedBloomLevel]
          );

          return (
            <>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Suas Estatísticas</h1>
                  <p className="text-lg">
                    Acompanhe seu progresso e conquistas
                  </p>
                </div>
                <StatsWidget userStats={userStats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 xl:col-span-4">
                  <AccuracyWidget accuracyWidget={accuracyWidget} />
                </div>

                <div className="lg:col-span-6 xl:col-span-3">
                  <TodayReviewWidget flashcards={todayReviewWidget} />
                </div>

                <div className="lg:col-span-12 xl:col-span-5">
                  <TopTagsWidget topTags={topTagsWidget} />
                </div>

                <div className="lg:col-span-12">
                  <BloomLevelWidget bloomData={bloomLevel} />
                </div>
              </div>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
