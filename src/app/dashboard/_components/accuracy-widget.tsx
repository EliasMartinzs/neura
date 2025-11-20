import { cn } from "@/lib/utils";
import { Award, Sparkles, Target, TrendingUp } from "lucide-react";
import { memo, useMemo } from "react";

type Props = {
  accuracyWidget: {
    accuracyRateCards: number;
    totalCorrectAnswers: number;
    totalWrongAnswers: number;
  };
};

function AccuracyWidgetComponent({
  accuracyWidget: { accuracyRateCards, totalCorrectAnswers, totalWrongAnswers },
}: Props) {
  const percent = Number(accuracyRateCards.toFixed(2));

  const performance = useMemo(() => {
    if (percent >= 80) {
      return {
        color: "from-emerald-500 via-teal-500 to-cyan-500",
        strokeColor: "#10b981",
        icon: Award,
        badge: "Excelente",
        badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      };
    }

    if (percent >= 60) {
      return {
        color: "from-blue-500 via-indigo-500 to-purple-500",
        strokeColor: "#3b82f6",
        icon: Target,
        badge: "Bom",
        badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    }

    return {
      color: "from-orange-500 via-amber-500 to-yellow-500",
      strokeColor: "#f97316",
      icon: TrendingUp,
      badge: "Em Progresso",
      badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
  }, [percent]);

  const PerformanceIcon = performance.icon;

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl transition-all duration-500 hover:shadow-3xl group">
        {/* Efeito de brilho de fundo animado */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${performance.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
          style={{ filter: "blur(60px)" }}
        />

        {/* Partículas decorativas */}
        <div
          className="absolute top-0 right-0 w-72 h-72 bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-full -translate-y-1/2 translate-x-1/2"
          style={{ filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 bg-linear-to-tr from-blue-500/10 to-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2"
          style={{ filter: "blur(60px)" }}
        />

        {/* Header */}
        <div className="relative p-6 pb-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Desempenho Médio
                </h2>
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-slate-400 text-base">
                Resumo geral da sua performance nos flashcards
              </p>
            </div>

            {/* Badge de status com ícone */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full border ${performance.badgeColor} font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm whitespace-nowrap`}
            >
              <PerformanceIcon className="w-4 h-4" />
              <span className="text-sm">{performance.badge}</span>
            </div>
          </div>
        </div>

        {/* Content - Chart */}
        <div className="relative px-6 pb-6">
          <div className="flex items-center justify-center py-8">
            <div className="relative w-64 h-64">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 240 240"
              >
                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Background circle */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke="rgba(148, 163, 184, 0.08)"
                  strokeWidth="20"
                  fill="none"
                />

                {/* Progress circle */}
                <circle
                  cx="120"
                  cy="120"
                  r={radius}
                  stroke="url(#progressGradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: "stroke-dashoffset 1s ease-out",
                    filter: "url(#glow)",
                  }}
                />
              </svg>

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-slate-700/30 rounded-full scale-150"
                      style={{ filter: "blur(24px)" }}
                    ></div>
                    <div className="relative">
                      <div
                        className="text-6xl font-extrabold text-white animate-pulse"
                        style={{
                          filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
                        }}
                      >
                        {accuracyRateCards.toFixed(1)}
                      </div>
                      <div className="h-0.5 bg-linear-to-r from-transparent via-slate-400 to-transparent my-3 mx-auto w-16"></div>
                      <div className="text-sm font-semibold text-slate-400 tracking-widest uppercase">
                        de média
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Indicadores de progresso */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="text-slate-400 text-xs font-medium mb-1">
                Taxa
              </div>
              <div className="text-white text-xl font-bold">
                {percent.toFixed(0)}%
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="text-slate-400 text-xs font-medium mb-1">
                Acertos
              </div>
              <div className="text-emerald-500 text-xl font-bold">
                {totalCorrectAnswers}
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="text-slate-400 text-xs font-medium mb-1">
                Erros
              </div>
              <div className="text-red-500 text-xl font-bold">
                {totalWrongAnswers}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex flex-col gap-3 p-6 pt-6 border-t border-slate-700">
          {/* Mensagem motivacional principal */}
          <div
            className={cn(
              "hidden items-center gap-3 w-full p-4 rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm",
              percent > 0 ? "flex" : null
            )}
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-sm font-semibold text-slate-200 leading-tight">
              Seu ritmo está acelerando — continue assim!
            </p>
          </div>

          {/* Informações adicionais */}
          <div className="w-full space-y-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <p>Média calculada dos últimos cards estudados</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <p>Dados baseados nas últimas sessões registradas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const AccuracyWidget = memo(AccuracyWidgetComponent);
AccuracyWidget.displayName = "AccuracyWidget";
