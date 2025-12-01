import { Brain, CheckCircle2, Flame, Trophy } from "lucide-react";
import { memo } from "react";

type Props = {
  totalCompleted: number;
  totalCorrect: number;
  totalQuestions: number;
  avgAccuracy: number;
  total: number;
};

const QuizStatsComponent = ({
  avgAccuracy,
  totalCompleted,
  totalCorrect,
  totalQuestions,
  total,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-4 backdrop-blur-sm text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-500/20 rounded-xl">
            <Trophy className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <p className="text-sm">Completados</p>
            <p className="text-3xl font-bold text-violet-300">
              {totalCompleted}
            </p>
          </div>
        </div>
      </div>

      <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-4 backdrop-blur-sm text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm">Acertos</p>
            <p className="text-3xl font-bold text-emerald-300">
              {totalCorrect}/{totalQuestions}
            </p>
          </div>
        </div>
      </div>

      <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-4 backdrop-blur-sm text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Flame className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-sm">Precisão</p>
            <p className="text-3xl font-bold text-amber-300">{avgAccuracy}%</p>
          </div>
        </div>
      </div>

      <div className="dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl p-4 backdrop-blur-sm text-white">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm">Total de Quizzes</p>
            <p className="text-3xl font-bold text-blue-300">{total}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuizStats = memo(QuizStatsComponent);
QuizStats.displayName = "QuizStats";
