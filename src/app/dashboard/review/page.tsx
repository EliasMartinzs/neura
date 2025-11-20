"use client";

import { Button } from "@/components/ui/button";
import { useGetReviews } from "@/features/study/api/use-get-reviews";
import { EmptyState } from "@/lib/query/empty-state";
import { ErrorState } from "@/lib/query/error-state";
import { FetchingIndicatorState } from "@/lib/query/fetching-indicatror-state";
import { LoadingState } from "@/lib/query/loading-state";
import { QueryState } from "@/lib/query/query-state";
import { Calendar, CalendarSync, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ReviewOverview } from "./_components/review-overview";
import { ReviewSessionCard } from "./_components/review-session-card";

export default function ReviewPage() {
  const [selected, setSelected] = useState<"overview" | "session">("overview");
  const query = useGetReviews();

  return (
    <QueryState
      query={query}
      loading={<LoadingState />}
      error={({ refetch }) => <ErrorState onRetry={refetch} />}
      fetchingIndicator={<FetchingIndicatorState />}
      empty={<EmptyState />}
    >
      {(data) => {
        const today = useMemo(() => data?.data?.today, [data?.data?.today]);
        const urgent = useMemo(() => data?.data?.urgent, [data?.data?.urgent]);

        return (
          <div className="space-y-4">
            <div className="relative p-6 border-b border-slate-700/50 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center max-sm:items-start gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50" />
                    <div className="relative bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-3 border border-purple-500/30 backdrop-blur-sm">
                      <Calendar className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold bg-linear-to-r from-foreground via-foreground/70 to-foreground/60 bg-clip-text text-transparent">
                      Timeline de Estudos
                    </h2>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                      Sistema de repetição espaçada em ação
                    </p>
                  </div>
                </div>

                {/* Total geral */}
                <div className="bg-linear-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl px-6 py-3 backdrop-blur-sm">
                  <div className="text-muted-foreground text-xs font-medium mb-1">
                    Total de Cards
                  </div>
                  <div className="text-4xl font-extrabold text-white">
                    {data?.data?.totalFlashcards || 0}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <Button
                  variant={"gradient"}
                  onClick={() =>
                    setSelected((prevState) =>
                      prevState === "overview" ? "session" : "overview"
                    )
                  }
                >
                  <CalendarSync strokeWidth={1.5} className="size-5" />{" "}
                  {selected !== "overview"
                    ? "Mostrar calendario"
                    : "Revisar meus cards"}
                </Button>
              </div>
            </div>

            {selected === "overview" ? (
              <ReviewOverview data={data.data} />
            ) : (
              <ReviewSessionCard today={today} urgent={urgent} />
            )}
          </div>
        );
      }}
    </QueryState>
  );
}
