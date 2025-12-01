"use client";
import { useGetQuiz } from "@/features/quiz/api/use-get-quiz";
import { useParams } from "next/navigation";

import { QuizSession } from "./_components/quiz-session";
import { useResetQuiz } from "@/features/quiz/api/use-reset-quiz";
import { QuizResults } from "./_components/quiz-results";
import { QuizAbandoned } from "./_components/quiz-abandoned";

export default function QuizStepPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data, isLoading } = useGetQuiz(sessionId);

  if (isLoading) return <div>Carregando...</div>;
  if (!data?.data) return <div>Erro ao carregar sessão</div>;

  const status = data?.data?.status;

  if (status === "COMPLETED") {
    return <QuizResults session={data.data} />;
  }

  if (status === "ABANDONED") {
    return <QuizAbandoned sessionId={sessionId} />;
  }

  return <QuizSession data={data?.data} />;
}
