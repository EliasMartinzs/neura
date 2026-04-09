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
import { getQueryState } from "@/lib/query/use-query-state";
import { BloomLevel } from "@prisma/client";
import { FlashcardBloomLevelCard } from "./_components/flashcard-bloom-level-card";
import { FlashcardEaseFactorCard } from "./_components/flashcard-ease-factor-card";
import { FlashcardHeaderCard } from "./_components/flashcard-header-card";
import { FlashcardPerformanceCard } from "./_components/flashcard-perfomance-card";
import { FlashcardReviewScheduleCard } from "./_components/flashcard-review-schedule-card";

export default function Flashcard() {
  const { id } = useParams<{ id: string }>();
  const [showStats, setShowStats] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  const query = useGetFlashcard(id);
  const { isLoading, isError, data, refetch, isFetching } = getQueryState(query);

  const flashcard = data?.data;

  const { bloomLevelConfig, getEaseFactorInfo, getPerformanceInfo, formatDate } =
    useHelperFlashcard(flashcard ?? null);

  const bloomLevel = flashcard?.bloomLevel
    ? bloomLevelConfig[flashcard.bloomLevel as BloomLevel]
    : undefined;
  const easeInfo = flashcard?.easeFactor
    ? getEaseFactorInfo(flashcard.easeFactor)
    : undefined;
  const performanceInfo = flashcard?.performanceAvg
    ? getPerformanceInfo(flashcard.performanceAvg * 100)
    : undefined;
  const nextReviewDate = formatDate(flashcard?.nextReview);
  const lastReviewDate = formatDate(flashcard?.lastReviewedAt);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
      </div>
    );
  }

  if (isError || !flashcard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Ocorreu um erro ao carregar o flashcard.</p>
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
    <div className="p-4 md:p-8">
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <BreadcrumbCustom
          href="/dashboard/flashcards"
          label="Voltar para flashcards"
        />
        <FlashcardHeaderCard
          topic={flashcard.topic}
          subtopic={flashcard.subtopic}
          setShowStats={setShowStats}
          showStats={showStats}
          id={id}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FlashcardDetail
              flashcard={flashcard}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />
          </div>

          {showStats && (
            <div className="space-y-4">
              <FlashcardPerformanceCard
                performanceAvg={flashcard.performanceAvg}
                performanceInfo={performanceInfo!}
              />

              <FlashcardEaseFactorCard
                easeFactor={flashcard.easeFactor}
                easeInfo={easeInfo!}
              />

              <FlashcardReviewScheduleCard
                interval={flashcard.interval}
                repetition={flashcard.repetition}
                lastReviewDate={lastReviewDate}
                nextReviewDate={nextReviewDate}
              />

              <FlashcardBloomLevelCard bloomLevel={bloomLevel} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}