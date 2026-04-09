"use client";

import { Button } from "@/components/ui/button";
import { useGetReviews } from "@/features/study/api/use-get-reviews";
import { Calendar, CalendarSync, Sparkles } from "lucide-react";
import { useState } from "react";
import { ReviewOverview } from "./_components/review-overview";
import { ReviewSessionCard } from "./_components/review-session-card";

export default function ReviewPage() {
  const [selected, setSelected] = useState<"overview" | "session">("overview");
  const { isLoading, isError, data, refetch, isFetching } = useGetReviews();

  const reviewData = data?.data;
  const today = reviewData?.today;
  const urgent = reviewData?.urgent;
  const totalFlashcards = reviewData?.totalFlashcards ?? 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-7 h-7 border-2 border-muted border-t-primary rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar as revisões.
        </p>
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
    <div className="space-y-4">
      {isFetching && (
        <div className="fixed top-4 right-4 z-50">
          <div className="animate-spin w-5 h-5 border-2 border-muted border-t-primary rounded-full" />
        </div>
      )}

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

          <div className="dark:bg-none bg-linear-to-br from-slate-700 to-slate-600 border rounded-2xl px-6 py-3 backdrop-blur-sm">
            <div className="text-white text-xs font-medium mb-1">
              Total de Cards
            </div>
            <div className="text-4xl font-extrabold text-white">
              {totalFlashcards}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Button
            onClick={() =>
              setSelected((prevState) =>
                prevState === "overview" ? "session" : "overview",
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
        <ReviewOverview data={reviewData} />
      ) : (
        <ReviewSessionCard today={today} urgent={urgent} />
      )}
    </div>
  );
}
