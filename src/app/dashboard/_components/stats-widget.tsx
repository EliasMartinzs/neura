import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Layers,
  RefreshCcw,
  SquarePen,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memo, useMemo } from "react";

type Props = {
  userStats: {
    decksCount: number;
    flashcardsCreated: number;
    studiesCompleted: number;
    totalReviews: number;
    lastStudyAt: string | null | undefined;
  };
};

function StatsWidgetComponent({ userStats }: Props) {
  const stats = useMemo(
    () => [
      {
        icon: Layers,
        value: userStats?.decksCount || 0,
        label: "Decks",
        color: "from-blue-500 to-cyan-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/30",
        iconBg: "bg-blue-500/20",
        textColor: "text-blue-400",
        link: "/dashboard/deck",
      },
      {
        icon: SquarePen,
        value: userStats?.flashcardsCreated || 0,
        label: "Flashcards",
        color: "from-purple-500 to-pink-500",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        iconBg: "bg-purple-500/20",
        textColor: "text-purple-400",
        link: "/dashboard/flashcards",
      },
      {
        icon: CheckCircle,
        value: userStats?.studiesCompleted || 0,
        label: "Completos",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/30",
        iconBg: "bg-emerald-500/20",
        textColor: "text-emerald-400",
        link: null,
      },
      {
        icon: RefreshCcw,
        value: userStats?.totalReviews || 0,
        label: "Revisões",
        color: "from-orange-500 to-amber-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        iconBg: "bg-orange-500/20",
        textColor: "text-orange-400",
        link: null,
      },
      {
        icon: Timer,
        value: userStats.lastStudyAt
          ? new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(userStats?.lastStudyAt))
          : "Nenhum registro até o momento",
        label: "Último estudo",
        color: "from-rose-500 to-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/30",
        iconBg: "bg-rose-500/20",
        textColor: "text-rose-400",
        link: null,
      },
    ],
    [userStats]
  );

  return (
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-4">
        <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-4 lg:contents">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden max-lg:flex-1 max-lg:basis-[45%]"
              >
                {/* Card */}
                <div
                  className={`relative h-full rounded-4xl bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border ${stat.borderColor} backdrop-blur-xl transition-all duration-500 hover:scale-[0.99]`}
                >
                  {/* Conteúdo */}
                  <div className="relative p-6 space-y-4">
                    {/* Header com ícone */}
                    <div className="flex items-center justify-between">
                      <div
                        className={`${stat.iconBg} rounded-xl p-3 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                      >
                        <Icon
                          className={`w-6 h-6 ${stat.textColor}`}
                          strokeWidth={1.5}
                        />
                      </div>

                      {/* Badge de tendência */}
                      {Number(stat.value) > 0 && (
                        <div
                          className={`flex items-center gap-1 ${stat.bgColor} ${stat.borderColor} border rounded-full px-2 py-1`}
                        >
                          <TrendingUp className={`w-3 h-3 ${stat.textColor}`} />
                          <span
                            className={`text-xs font-semibold ${stat.textColor}`}
                          >
                            +
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Valor principal */}
                    <div className="space-y-1">
                      <div
                        className={cn(
                          " text-white transition-all duration-700 mb-2",
                          stat.value === "Nenhum registro até o momento"
                            ? "text-md"
                            : "text-2xl"
                        )}
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                        }}
                      >
                        {stat.value}
                      </div>

                      {/* Linha decorativa */}
                      <div
                        className={`h-1 bg-linear-to-r ${stat.color} rounded-full w-12 transition-all duration-500 group-hover:w-20`}
                      />
                    </div>

                    {/* Label */}
                    <div>
                      {stat.link ? (
                        <a
                          href={stat.link}
                          className={`text-md font-semibold text-slate-300 hover:${stat.textColor} transition-colors duration-300 flex items-center gap-2 group/link`}
                        >
                          {stat.label}
                          <Zap className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <p className="text-md font-semibold text-slate-300">
                          {stat.label}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const StatsWidget = memo(StatsWidgetComponent);
StatsWidget.displayName = "StatsWidget";
