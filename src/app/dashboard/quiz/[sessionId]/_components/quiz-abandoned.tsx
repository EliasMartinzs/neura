import { Button } from "@/components/ui/button";
import { useResetQuiz } from "@/features/quiz/api/use-reset-quiz";
import { AlertTriangle, Loader2 } from "lucide-react";

export const QuizAbandoned = ({ sessionId }: { sessionId: string }) => {
  const { mutate, isPending } = useResetQuiz();

  const handleReset = () => {
    mutate({
      sessionId,
    });
  };

  return (
    <div className="relative group w-full min-h-[70svh] overflow-hidden flex items-center justify-center flex-col">
      <div className="relative overflow-hidden">
        <div className={`p-12 bg-linear-to-r `}>
          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex p-8 bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl mb-6 animate-bounce">
              <AlertTriangle className="w-24 h-24 text-orange-400" />
            </div>

            {/* Title */}
            <h1 className="text-6xl md:text-7xl font-black text-white mb-3 drop-shadow-2xl">
              Quiz interrompido
            </h1>
            <p className="text-2xl font-bold text-white/90 mb-6">
              Você deixou este quiz antes de concluir.
            </p>
            <p>
              Para garantir uma experiência consistente e respostas sempre
              precisas, seu progresso será reiniciado e você poderá começar
              novamente quando quiser.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <Button variant={"gradientLife"} size={"lg"} onClick={handleReset}>
          {isPending ? (
            <Loader2 className="animate-spin size-5" />
          ) : (
            "Recomeçar meu quiz"
          )}
        </Button>
      </div>
    </div>
  );
};
