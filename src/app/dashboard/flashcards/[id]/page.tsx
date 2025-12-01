"use client";

import {
  ResponseFlashcard,
  useGetFlashcard,
} from "@/features/flashcard/api/use-get-flashcard";
import { useParams } from "next/navigation";
import { useState } from "react";

import { useHelperFlashcard } from "@/hooks/use-helper-flashcard";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { BloomLevel } from "@prisma/client";
import { FlashcardBloomLevelCard } from "./_components/flashcard-bloom-level-card";
import { FlashcardEaseFactorCard } from "./_components/flashcard-ease-factor-card";
import { FlashcardHeaderCard } from "./_components/flashcard-header-card";
import { FlashcardPerformanceCard } from "./_components/flashcard-perfomance-card";
import { FlashcardReviewScheduleCard } from "./_components/flashcard-review-schedule-card";

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export default function Flashcard() {
  const { id } = useParams<{ id: string }>();
  const [showStats, setShowStats] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const query = useGetFlashcard(id);

  return (
    <div className="p-4 md:p-8">
      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => {
          if (!data?.data) return;

          const flashcard = data?.data;

          const {
            getEaseFactorInfo,
            getPerformanceInfo,
            formatDate,
            bloomLevelConfig,
          } = useHelperFlashcard(flashcard);

          const bloomLevel =
            bloomLevelConfig[flashcard?.bloomLevel as BloomLevel];
          const easeInfo = getEaseFactorInfo(flashcard?.easeFactor as number);
          const performanceInfo = getPerformanceInfo(
            flashcard?.performanceAvg! * 100
          );
          const nextReviewDate = formatDate(flashcard?.nextReview);
          const lastReviewDate = formatDate(flashcard?.lastReviewedAt);

          return (
            <div className="max-w-6xl mx-auto space-y-6">
              <BreadcrumbCustom
                href="/dashboard/flashcards"
                label="Voltar para flashcards"
              />
              {/* Header Info Bar */}
              <FlashcardHeaderCard
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
                    <FlashcardPerformanceCard
                      performanceAvg={flashcard.performanceAvg}
                      performanceInfo={performanceInfo}
                    />

                    {/* Ease Factor Card */}
                    <FlashcardEaseFactorCard
                      easeFactor={flashcard.easeFactor}
                      easeInfo={easeInfo}
                    />

                    {/* Review Schedule */}
                    <FlashcardReviewScheduleCard
                      interval={flashcard.interval}
                      repetition={flashcard.repetition}
                      lastReviewDate={lastReviewDate}
                      nextReviewDate={nextReviewDate}
                    />

                    {/* Bloom Level Info */}
                    <FlashcardBloomLevelCard bloomLevel={bloomLevel} />
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </QueryState>
    </div>
  );
}
