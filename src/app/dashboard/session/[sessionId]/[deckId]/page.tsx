"use client";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { CompletedCardReview } from "@/components/shared/completed-card-review";
import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { ReviewCardForm } from "@/components/shared/review-card-form";
import { ScoreBadges } from "@/components/shared/score-badges";
import { useGetSummary } from "@/features/study/api/use-get-summary";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function SessionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { deckId, sessionId } = useParams<{
    sessionId: string;
    deckId: string;
  }>();

  const query = useGetSummary(sessionId);

  return (
    <QueryState
      query={query}
      loading={<LoadingState />}
      empty={<EmptyState />}
      error={({ refetch }) => <ErrorState onRetry={refetch} />}
      fetchingIndicator={<FetchingIndicatorState />}
    >
      {({ data }) => {
        const bg = `linear-gradient(to bottom right, ${
          data?.nextCard?.color ?? "#7c3aed"
        }, ${data?.nextCard?.color ?? "#7c3aed"}99, ${
          data?.nextCard?.color ?? "#7c3aed"
        }cc)`;

        if (data?.completed || !data?.nextCard) {
          return (
            <CompletedCardReview
              accuracy={data?.accuracy!}
              correctCount={data?.correctCount!}
              wrongCount={data?.wrongCount!}
              deckId={deckId}
              sessionId={sessionId}
            />
          );
        }

        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <BreadcrumbCustom
                href={`/dashboard/deck/${deckId}`}
                label="Voltar para o deck"
              />
              <h1 className="text-5xl font-black bg-linear-to-r from-primary via-primary/50 to-primary inline-block text-transparent bg-clip-text">
                {data?.deckTitle}
              </h1>

              <p className="text-2xl">
                Flashcards {Number(data?.reviewedFlashcards) + 1} de{" "}
                {data?.totalFlashcards}
              </p>
            </div>

            <ScoreBadges
              correctCount={Number(data?.correctCount)}
              wrongCount={Number(data?.wrongCount)}
            />

            <FlashcardDetail
              flashcard={data?.nextCard}
              showDiff={false}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
            />

            {isFlipped && (
              <ReviewCardForm
                sessionId={sessionId}
                flashcardId={data?.nextCard?.id as string}
                bg={bg}
                setIsFlipped={setIsFlipped}
              />
            )}
          </div>
        );
      }}
    </QueryState>
  );
}
