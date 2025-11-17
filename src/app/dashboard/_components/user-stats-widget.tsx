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
import { useEffect, useState } from "react";

type Props = {
  userStats: {
    decksCount: number;
    flashcardsCreated: number;
    studiesCompleted: number;
    totalReviews: number;
    lastStudyAt: string | null | undefined;
  };
};

export function UserStatsWidget({ userStats }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
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
  ];

  return (
    <div className="w-full">
      <div className="lg:grid lg:grid-cols-3 xl:grid-cols-5 gap-2 lg:gap-4">
        <div className="flex flex-wrap justify-center items-center gap-2 lg:gap-4 lg:contents">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const animatedValue = animated ? stat.value : 0;

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden max-lg:flex-1 max-lg:basis-[45%]"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
              >
                {/* Card */}
                <div
                  className={`relative h-full rounded-4xl bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border ${stat.borderColor} backdrop-blur-xl transition-all duration-500 hover:scale-101`}
                >
                  {/* Efeito de brilho */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`}
                  />

                  {/* Partícula decorativa */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-linear-to-br ${stat.color} opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl`}
                  />

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
                          " text-white transition-all duration-700",
                          typeof animatedValue === "string"
                            ? "text-xl"
                            : "text-5xl font-extrabold"
                        )}
                        style={{
                          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
                        }}
                      >
                        {animatedValue}
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
                          className={`text-lg font-semibold text-slate-300 hover:${stat.textColor} transition-colors duration-300 flex items-center gap-2 group/link`}
                        >
                          {stat.label}
                          <Zap className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <p className="text-lg font-semibold text-slate-300">
                          {stat.label}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Borda animada no hover */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-500 -z-10`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
