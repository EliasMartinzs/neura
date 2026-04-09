"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetQuizs } from "@/features/quiz/api/use-get-quizs";
import { useQuizFilterStore } from "@/features/quiz/hooks/use-quiz-filter-store";
import { useQuizStats } from "@/features/quiz/hooks/use-quiz-stats";
import { QuizDocumentation } from "./_components/quiz-documentation";
import { QuizFilters } from "./_components/quiz-filters";
import { QuizList } from "./_components/quiz-list";
import { QuizStats } from "./_components/quiz-stats";

export default function QuizPage() {
  const { filter, page, perPage, setPage } = useQuizFilterStore();
  const { isLoading, isError, data, refetch, isFetching } = useGetQuizs({
    filter,
    page,
    perPage,
  });

  const quizzes = data?.data ?? [];
  const totalPages = (data as { totalPages?: number })?.totalPages ?? 0;

  const {
    calculateScore,
    calculateAccuracy,
    totalCorrect,
    totalQuestions,
    avgAccuracy,
    totalCompleted,
  } = useQuizStats(quizzes, filter);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Title>Quiz</Title>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-muted-foreground">
            Ocorreu um erro ao carregar os quizzes.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {isFetching && (
            <div className="fixed top-4 right-4 z-50">
              <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
            </div>
          )}

          <QuizStats
            total={quizzes.length}
            avgAccuracy={avgAccuracy}
            totalCompleted={totalCompleted}
            totalCorrect={totalCorrect}
            totalQuestions={totalQuestions}
          />

          <QuizFilters />

          <QuizDocumentation />

          <QuizList
            calculateAccuracy={calculateAccuracy}
            calculateScore={calculateScore}
            filteredQuizzes={quizzes}
            totalCompleted={totalCompleted}
          />

          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
