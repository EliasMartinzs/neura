"use client";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Title } from "@/components/shared/title";
import { useGetQuizs } from "@/features/quiz/api/use-get-quizs";
import { useQuizFilterStore } from "@/features/quiz/hooks/use-quiz-filter-store";
import { useQuizStats } from "@/features/quiz/hooks/use-quiz-stats";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { CreateQuizButton } from "./_components/create-quiz-button";
import { QuizFilters } from "./_components/quiz-filters";
import { QuizList } from "./_components/quiz-list";
import { QuizStats } from "./_components/quiz-stats";
import { QuizDocumentation } from "./_components/quiz-documentation";

export default function QuizPage() {
  const { filter, page, perPage, setPage } = useQuizFilterStore();
  const query = useGetQuizs({
    filter,
    page,
    perPage,
  });

  return (
    <QueryState
      query={query}
      loading={<LoadingState />}
      error={({ refetch }) => <ErrorState onRetry={refetch} />}
      fetchingIndicator={<FetchingIndicatorState />}
    >
      {(data) => {
        const quizzes = data?.data ?? [];

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

            <QuizStats
              total={data?.data?.length ?? 0}
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
              totalPages={"totalPages" in data ? data.totalPages : 0}
            />
          </div>
        );
      }}
    </QueryState>
  );
}
