"use client";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { CompletedCardReview } from "@/components/shared/completed-card-review";
import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { ReviewCardForm } from "@/components/shared/review-card-form";
import { ScoreBadges } from "@/components/shared/score-badges";
import { useGetSummary } from "@/features/study/api/use-get-summary";
import { getQueryState } from "@/lib/query/use-query-state";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ResponseFlashcard } from "@/features/flashcard/api/use-get-flashcard";

type Flashcard = NonNullable<ResponseFlashcard>["data"];

export default function SessionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const { deckId, sessionId } = useParams<{
    sessionId: string;
    deckId: string;
  }>();

  const query = useGetSummary(sessionId);
  const { isLoading, isError, data, refetch, isFetching } = getQueryState(query);

  const sessionData = data as { 
    completed?: boolean; 
    nextCard?: Flashcard; 
    accuracy?: number; 
    correctCount?: number; 
    wrongCount?: number;
    deckTitle?: string;
    reviewedFlashcards?: number;
    totalFlashcards?: number;
  } | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
      </div>
    );
  }

  if (isError || !sessionData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Ocorreu um erro ao carregar a sessão.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const isCompleted = sessionData.completed || !sessionData.nextCard;

  if (isCompleted) {
    return (
      <CompletedCardReview
        accuracy={String(sessionData?.accuracy ?? 0)}
        correctCount={sessionData?.correctCount ?? 0}
        wrongCount={sessionData?.wrongCount ?? 0}
        deckId={deckId}
        sessionId={sessionId}
      />
    );
  }

  const bg = `linear-gradient(to bottom right, ${
    sessionData?.nextCard?.color ?? "#7c3aed"
  }, ${sessionData?.nextCard?.color ?? "#7c3aed"}99, ${
    sessionData?.nextCard?.color ?? "#7c3aed"
  }cc)`;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      <div>
        <BreadcrumbCustom
          href={`/dashboard/deck/${deckId}`}
          label="Voltar para o deck"
        />
        <h1 className="text-5xl font-black bg-linear-to-r from-primary via-primary/50 to-primary inline-block text-transparent bg-clip-text">
          {sessionData?.deckTitle}
        </h1>

        <p className="text-2xl">
          Flashcards {Number(sessionData?.reviewedFlashcards) + 1} de{" "}
          {sessionData?.totalFlashcards}
        </p>
      </div>

      <ScoreBadges
        correctCount={Number(sessionData?.correctCount)}
        wrongCount={Number(sessionData?.wrongCount)}
      />

      <FlashcardDetail
        flashcard={sessionData?.nextCard}
        showDiff={false}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />

      {isFlipped && (
        <ReviewCardForm
          sessionId={sessionId}
          flashcardId={sessionData?.nextCard?.id as string}
          bg={bg}
          setIsFlipped={setIsFlipped}
        />
      )}
    </div>
  );
}