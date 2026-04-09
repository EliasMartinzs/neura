"use client";

import { Title } from "@/components/shared/title";

import { PaginationComponent } from "@/components/shared/pagination-component";
import { Input } from "@/components/ui/input";
import { useGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import { useExplainQuestionsFiltersStore } from "@/features/explain-learn/hooks/use-explain-filters-store";
import { getQueryState } from "@/lib/query/use-query-state";
import { Search } from "lucide-react";
import { useState } from "react";
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

  const { isLoading, isError, data, refetch, isFetching } = getQueryState(query);

  const stats =
    data && "stats" in data
      ? data.stats
      : { completed: 0, pending: 0, avg: 0, total: 0 };

  const filteredData = data?.data?.filter((item) =>
    item.topic.toLowerCase().includes(searchTerm)
  ) ?? [];

  const totalPages = (data as { totalPages?: number })?.totalPages ?? 0;

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

      {isLoading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
          <p className="text-muted-foreground">Ocorreu um erro ao carregar as perguntas.</p>
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

          <QuestionCard data={filteredData} />

          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </>
      )}
    </main>
  );
}