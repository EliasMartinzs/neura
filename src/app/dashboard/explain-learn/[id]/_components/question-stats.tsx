import { CheckCircle2, Clock, Target, Trophy } from "lucide-react";
import { memo, useMemo } from "react";

type Props = {
  stats: {
    total: number;
    completed: number;
    pending: number;
    avg: number;
  };
};

export const QuestionStatsComponent = ({ stats }: Props) => {
  const items = useMemo(
    () => [
      {
        label: "Estudos",
        value: stats.total,
        icon: Target,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Completados",
        value: stats.completed,
        icon: CheckCircle2,
        gradient: "from-emerald-500 to-teal-500",
      },
      {
        label: "Pendentes",
        value: stats.pending,
        icon: Clock,
        gradient: "from-amber-500 to-orange-500",
      },
      {
        label: "Pontuação",
        value: `${stats.avg}%`,
        icon: Trophy,
        gradient: "from-purple-500 to-pink-500",
      },
    ],
    [stats]
  );

  return (
    <div className="mb-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((stat) => (
          <div key={stat.label} className="group relative">
            <div
              className={`absolute inset-0 bg-linear-to-br rounded-4xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity shadow-2xl`}
            ></div>
            <div className="relative bg-linear-to-br text-white from-slate-700 via-slate-600 to-slate-800 dark:bg-none backdrop-blur-3xl rounded-4xl p-6 border transition-all transform group-hover:scale-105 group-hover:-translate-y-1">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-3 bg-linear-to-br ${stat.gradient} rounded-xl shadow-lg`}
                >
                  <stat.icon className="w-6 h-6 " />
                </div>
              </div>
              <div className="text-4xl font-black mb-1">{stat.value}</div>
              <div className="font-medium text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const QuestionStats = memo(QuestionStatsComponent);
QuestionStats.displayName = "QuestionStats";
