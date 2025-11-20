import {
  Award,
  ChevronLeft,
  Flame,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { Button } from "../ui/button";
import { useEndSession } from "@/features/study/api/use-end-session";
import { useRouter } from "next/navigation";

export const CompletedCardReview = ({
  accuracy,
  correctCount,
  wrongCount,
  sessionId,
  deckId,
}: {
  correctCount: number;
  wrongCount: number;
  accuracy: string;
  sessionId: string;
  deckId: string;
}) => {
  const router = useRouter();
  const { mutate: mutateEndSession, isPending } = useEndSession();

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
