"use client";

import { Title } from "@/components/shared/title";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Input } from "@/components/ui/input";
import { useGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import { useExplainQuestionsFiltersStore } from "@/features/explain-learn/hooks/use-explain-filters-store";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionCard } from "./[id]/_components/question-card";
import { QuestionFilters } from "./[id]/_components/question-filters";
import { QuestionStats } from "./[id]/_components/question-stats";
import { ExplainQuestionDocumentation } from "./_components/explain-question-documentation";

export default function ExplainLearnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { filter, page, perPage, setPage, setFilter } =
    useExplainQuestionsFiltersStore();

  const query = useGetExplainQuestions({
    page,
    filter,
    perPage,
  });

  const stats =
    query.data && "stats" in query.data
      ? query.data.stats
      : { completed: 0, pending: 0, avg: 0, total: 0 };

  return (
    <main className="space-y-10 max-w-7xl mx-auto relative z-10">
      <Title>Explique e Aprenda</Title>

      <QuestionFilters filter={filter} handleFilter={setFilter} />

      <ExplainQuestionDocumentation />

      <QuestionStats stats={stats} />

      <div className="relative flex items-center">
        <Input
          className="max-w-xl bg-linear-to-br dark:bg-none from-slate-700 via-slate-600 to-slate-700 placeholder:text-white text-white pl-10 h-14"
          placeholder="Busque por perguntas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
        <Search className="size-5 absolute left-3 text-white" />
      </div>

      <QueryState
        query={query}
        loading={<LoadingState />}
        error={({ refetch }) => <ErrorState onRetry={refetch} />}
        fetchingIndicator={<FetchingIndicatorState />}
      >
        {(data) => {
          const filteredData = useMemo(() => {
            return (
              data.data?.filter((item) =>
                item.topic.toLowerCase().includes(searchTerm)
              ) ?? []
            );
          }, [data.data, searchTerm]);

          return (
            <>
              <QuestionCard data={filteredData} />

              <PaginationComponent
                page={page}
                setPage={setPage}
                totalPages={"totalPages" in data ? data.totalPages : 0}
              />
            </>
          );
        }}
      </QueryState>
    </main>
  );
}
