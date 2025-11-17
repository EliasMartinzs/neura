"use client";

import { BreadcrumbCustom } from "@/components/shared/breadcrumb-custom";
import { FlashcardDetail } from "@/components/shared/flashcard-detail";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GRADES } from "@/constants/grades";
import { useCreateReview } from "@/features/study/use-create-review";
import { useGetSummary } from "@/features/study/use-get-summary";
import { cn } from "@/lib/utils";
import {
  ReviewFlashcardForm,
  reviewFlashcardSchema,
} from "@/schemas/review-flashcard";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Award,
  Brain,
  ChevronLeft,
  Flame,
  Loader2,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ErrorImage from "../../../../../../public/undraw_no-data.svg";
import { useEndSession } from "@/features/study/use-end-session";

export default function SessionPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const router = useRouter();
  const { deckId, sessionId } = useParams<{
    sessionId: string;
    deckId: string;
  }>();

  const { data, isError, isLoading, isRefetching, refetch } =
    useGetSummary(sessionId);
  const { mutate: mutateEndSession, isPending } = useEndSession();

  if (isLoading) {
    return (
      <div className="w-full h-svh overflow-hidden absolute top-0 left-0 -z-50 flex items-center justify-center">
        <Loader2 className="size-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-svh overflow-hidden absolute top-0 left-0 -z-50 flex flex-col gap-y-8 items-center justify-center">
        <Image src={ErrorImage} alt="error image" className="size-64" />

        <p>Houve um erro ao carregar seus dados. Tente novamente</p>

        <Button onClick={() => refetch()} variant={"outline"}>
          {isRefetching ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            "Recarregar"
          )}
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-svh overflow-hidden absolute top-0 left-0 -z-50 flex flex-col gap-y-8 items-center justify-center">
        <Image src={ErrorImage} alt="error image" className="size-64" />
        <p>Não foi encontrado nenhuma seção de estudos.</p>

        <Link
          href={`/dashboard/deck/${deckId}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft /> Voltar para o deck
        </Link>
      </div>
    );
  }

  const {
    correctCount,
    deckTitle,
    nextCard,
    reviewedFlashcards,
    totalFlashcards,
    wrongCount,
    completed,
    accuracy,
  } = data;

  const bg = `linear-gradient(to bottom right, ${
    nextCard?.color ?? "#7c3aed"
  }, ${nextCard?.color ?? "#7c3aed"}99, ${nextCard?.color ?? "#7c3aed"}cc)`;

  async function handleEndSession() {
    mutateEndSession(
      {
        sessionId,
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/deck/${deckId}`);
        },
      }
    );
  }

  if (completed || !nextCard) {
    return (
      <Completed
        accuracy={accuracy}
        correctCount={correctCount}
        wrongCount={wrongCount}
        id={deckId}
        handleEndSession={handleEndSession}
        isPending={isPending}
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
          {deckTitle}
        </h1>

        <p className="text-2xl">
          Flashcards {reviewedFlashcards + 1} de {totalFlashcards}
        </p>
      </div>

      <ScoreBadges correctCount={correctCount} wrongCount={wrongCount} />

      <FlashcardDetail
        flashcard={nextCard}
        showDiff={false}
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
      />

      {isFlipped && (
        <ReviewCard
          sessionId={sessionId}
          flashcardId={nextCard?.id as string}
          bg={bg}
          setIsFlipped={setIsFlipped}
        />
      )}
    </div>
  );
}

const ScoreBadges = ({
  correctCount,
  wrongCount,
}: {
  correctCount: number;
  wrongCount: number;
}) => {
  return (
    <div className="flex gap-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="text-2xl font-bold text-white">{correctCount}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl px-6 py-3 flex items-center gap-3">
          <Flame className="w-5 h-5 text-rose-400" />
          <span className="text-2xl font-bold text-white">{wrongCount}</span>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({
  sessionId,
  flashcardId,
  bg,
  setIsFlipped,
}: {
  sessionId: string;
  flashcardId: string;
  bg: string;
  setIsFlipped: (prev: boolean) => void;
}) => {
  const form = useForm<ReviewFlashcardForm>({
    resolver: zodResolver(reviewFlashcardSchema),
    defaultValues: {
      sessionId: sessionId,
      flashcardId: flashcardId,
      grade: undefined,
      notes: "",
      timeToAnswer: 0,
    },
  });

  const { mutate, isPending } = useCreateReview();

  const isLoading = form.formState.isSubmitting || isPending;
  const isGradeSelected = form.watch("grade");

  async function handleSendReview(data: ReviewFlashcardForm) {
    mutate(data, {
      onSuccess: () => {
        setIsFlipped(false);
        form.reset();
      },
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <p className="text-center font-medium text-lg">Avalie seu conhecimento</p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSendReview)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="grid grid-cols-3 gap-3">
                    {GRADES.map(({ color, icon, label, value, bg }) => {
                      const Icon = icon;
                      return (
                        <button
                          key={value}
                          className={cn(
                            "rounded-xl p-6 font-medium flex items-center justify-center gap-3 flex-col border hover:scale-105 transition-all duration-200 cursor-pointer",
                            isGradeSelected === value && bg,
                            color
                          )}
                          value={field.value}
                          onClick={() => field.onChange(value)}
                          type="button"
                        >
                          <Icon
                            className={cn(
                              isGradeSelected === value && "text-white"
                            )}
                          />{" "}
                          <span
                            className={cn(
                              isGradeSelected === value && "text-white"
                            )}
                          >
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gostaria de adicionar alguma nota?</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Algo sobre a pergunta, etc..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex justify-center">
            <Button
              size={"lg"}
              className="flex items-center gap-2  hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
              style={{
                background: bg,
              }}
            >
              {isLoading ? (
                <Sparkles className="w-5 h-5 transition-transform duration-300 animate-pulse" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 transition-transform duration-300 animate-pulse" />
                  <span className="font-medium">Salvar</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6 p-5 rounded-2xl backdrop-blur-sm">
        <p className="text-center flex items-center justify-center gap-2">
          <Brain className="w-4 h-4" />
          Sistema de repetição espaçada (SM-2) ativo
        </p>
      </div>
    </div>
  );
};

const Completed = ({
  accuracy,
  correctCount,
  wrongCount,
  id,
  isPending,
  handleEndSession,
}: {
  correctCount: number;
  wrongCount: number;
  accuracy: string;
  id: string;
  isPending: boolean;
  handleEndSession: () => void;
}) => {
  return (
    <div className="relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative z-10 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-5xl w-full">
          {/* Trophy Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-28 h-28 mb-6 relative">
              <div className="absolute inset-0 bg-linear-to-tr from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-background rounded-full"></div>
              <Trophy className="w-14 h-14 text-yellow-400 relative z-10" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-linear-to-r from-primary via-primary/50 to-primary/20 bg-clip-text text-transparent leading-tight">
              Sessão Concluída!
            </h1>

            <p className="text-xl">Parabéns pelo seu esforço 🎉</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-8 hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-4">
                  <Target className="w-7 h-7 text-emerald-400" />
                </div>
                <div className="text-5xl font-bold text-emerald-500 mb-2">
                  {correctCount}
                </div>
                <div className="text-emerald-400 font-medium">
                  Respostas Corretas
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-rose-500/10 to-rose-600/5 border border-rose-500/20 p-8 hover:border-rose-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex p-4 bg-rose-500/10 rounded-2xl mb-4">
                  <Flame className="w-7 h-7 text-rose-400" />
                </div>
                <div className="text-5xl font-bold text-rose-500 mb-2">
                  {wrongCount}
                </div>
                <div className="text-rose-400 font-medium">Para Revisar</div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 p-8 hover:border-indigo-500/40 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              <div className="relative">
                <div className="inline-flex p-4 bg-indigo-500/10 rounded-2xl mb-4">
                  <TrendingUp className="w-7 h-7 text-indigo-400" />
                </div>
                <div className="text-5xl font-bold text-indigo-500 mb-2">
                  {accuracy}%
                </div>
                <div className="text-indigo-400 font-medium">
                  Taxa de Acerto
                </div>
              </div>
            </div>
          </div>

          {/* Achievement Badge */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-full backdrop-blur-sm">
              <Award className="w-6 h-6 text-amber-400" />
              <span className="text-amber-400 font-semibold text-lg">
                {Number(accuracy) >= 80
                  ? "Desempenho Excepcional!"
                  : 80 >= 60
                  ? "Ótimo Trabalho!"
                  : "Continue Evoluindo!"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Button
              className="group relative px-10 py-7 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-105 border-0 "
              disabled={isPending}
              onClick={handleEndSession}
            >
              {isPending ? (
                <div className="flex items-center gap-x-3">
                  <Sparkles className="size-5 animate-pulse" /> encerrando...
                </div>
              ) : (
                <div className="flex items-center gap-x-3">
                  <ChevronLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Voltar para o deck
                  <Rocket className="w-5 h-5 animate-pulse" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
