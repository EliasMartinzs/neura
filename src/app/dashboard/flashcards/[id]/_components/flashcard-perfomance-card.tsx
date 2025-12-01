import { Star, TrendingUp } from "lucide-react";

export const FlashcardPerformanceCard = ({
  performanceInfo,
  performanceAvg,
}: {
  performanceInfo: {
    label: string;
    color: string;
    bg: string;
  };
  performanceAvg: number | null;
}) => {
  const percent = performanceAvg ? performanceAvg * 100 : 0;

  return (
    <div className="backdrop-blur-sm overflow-hidden dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl py-6 text-white">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Desempenho
          </h3>
          <span className={`text-sm font-medium ${performanceInfo.color}`}>
            {performanceInfo.label}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold ">{percent}%</span>
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden">
            <div
              className={`h-full ${performanceInfo.bg} rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs">Média de acertos nas últimas revisões</p>
        </div>
      </div>
    </div>
  );
};
