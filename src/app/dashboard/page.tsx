'use client';

import { Title } from '@/components/shared/title';
import { useDashboard } from '@/features/session/api/use-dashboard';
import { ErrorState } from '@/lib/query/error-state';
import { FetchingIndicatorState } from '@/lib/query/fetching-indicatror-state';
import { LoadingState } from '@/lib/query/loading-state';
import { QueryState } from '@/lib/query/query-state';
import { StudiedCategory } from '@/utils/type';
import { useMemo } from 'react';
import { AccuracyWidget } from './_components/accuracy-widget';
import { BloomLevelWidget } from './_components/bloom-level-widget';
import { StatsWidget } from './_components/stats-widget';
import { TodayReviewWidget } from './_components/today-review-widget';
import { TopTagsWidget } from './_components/top-tags-widget';

type BloomStatus = {
  level: string;
  count: number;
};

export default function DashboardPage() {
  const query = useDashboard();

  return (
    <div className="space-y-10 relative z-10">
      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
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

          const todayReviewWidget = data?.data?.cardsReviewToday ?? [];
          const topTagsWidget = data?.data?.stats
            ?.mostStudiedCategories as StudiedCategory[];
          const bloomLevel = data?.data?.stats
            ?.mostStudiedBloomLevel as BloomStatus[];

          return (
            <>
              <div className="space-y-6">
                <div>
                  <Title>Suas Estatísticas</Title>
                  <p className="font-light">
                    Acompanhe seu progresso e conquistas
                  </p>
                </div>
                <StatsWidget userStats={userStats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AccuracyWidget accuracyWidget={accuracyWidget} />
                <TodayReviewWidget flashcards={todayReviewWidget} />
                <BloomLevelWidget bloomData={bloomLevel} />
                <TopTagsWidget topTags={topTagsWidget} />
              </div>
            </>
          );
        }}
      </QueryState>
    </div>
  );
}
