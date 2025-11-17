import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  bloomData: {
    level: string;
    count: number;
  }[];
};

export const BloomLevelWidget = ({ bloomData }: Props) => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  console.log(bloomData);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (isDesktop === null) {
    return null;
  }

  const bloomLevels = [
    {
      value: "REMEMBER",
      label: "Lembrar",
      icon: "🧠",
      description: "Recordar informações",
      color: "#8b5cf6",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      value: "UNDERSTAND",
      label: "Entender",
      icon: "💡",
      description: "Explicar ideias",
      color: "#06b6d4",
      gradient: "from-cyan-500 to-blue-600",
    },
    {
      value: "APPLY",
      label: "Aplicar",
      icon: "🔧",
      description: "Usar conhecimento",
      color: "#10b981",
      gradient: "from-emerald-500 to-green-600",
    },
    {
      value: "ANALYZE",
      label: "Analisar",
      icon: "🔍",
      description: "Examinar detalhes",
      color: "#f59e0b",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      value: "EVALUATE",
      label: "Avaliar",
      icon: "⚖️",
      description: "Julgar informações",
      color: "#ef4444",
      gradient: "from-red-500 to-rose-600",
    },
    {
      value: "CREATE",
      label: "Criar",
      icon: "✨",
      description: "Produzir algo novo",
      color: "#ec4899",
      gradient: "from-pink-500 to-fuchsia-600",
    },
  ];

  const enrichedData = bloomData.map((data) => {
    const level = bloomLevels.find((l) => l.value === data.level);
    return { ...data, ...level };
  });

  const totalCards = enrichedData.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...enrichedData.map((d) => d.count));

  return (
    <div className="w-full lg:max-w-7xl p-6 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">🎯</span>
            Progressão Bloom
          </h2>
          {true && (
            <div className="text-right">
              <div className="text-sm text-slate-400">Total de Cards</div>
              <div className="text-3xl font-bold text-white">{totalCards}</div>
            </div>
          )}
        </div>
        <p className="text-slate-400">
          Sua jornada do conhecimento básico até a maestria
        </p>
      </div>

      {true ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pyramid Visual */}
            <div className="mb-8 relative">
              <div className="space-y-2">
                {enrichedData
                  .sort((a, b) => b.count - a.count)
                  .map((level, index) => {
                    const percentage = (level.count / totalCards) * 100;
                    const isSelected = selectedLevel === level.value;

                    return (
                      <div
                        key={level.value}
                        className="relative"
                        style={{
                          paddingLeft: `${index * 2}%`,
                          paddingRight: `${index * 2}%`,
                        }}
                      >
                        <button
                          onClick={() =>
                            setSelectedLevel(
                              isSelected ? null : (level?.value as string)
                            )
                          }
                          className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 ${
                            isSelected
                              ? "scale-105 shadow-2xl"
                              : "hover:scale-102 hover:shadow-xl"
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${level.color}20, ${level.color}40)`,
                            border: `2px solid ${level.color}60`,
                          }}
                        >
                          {/* Progress Bar Background */}
                          <div
                            className={`absolute inset-0 bg-linear-to-r ${level.gradient} opacity-30 transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />

                          {/* Content */}
                          <div className="relative flex items-center justify-between p-4 z-10">
                            <div className="flex items-center gap-4">
                              <span className="text-4xl filter drop-shadow-lg">
                                {level.icon}
                              </span>
                              <div className="text-left">
                                <div className="font-bold text-white text-lg">
                                  {level.label}
                                </div>
                                <div className="text-sm text-slate-300">
                                  {level.description}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                  {level.count}
                                </div>
                                <div className="text-xs text-slate-400">
                                  cards
                                </div>
                              </div>
                              {percentage > 0 && (
                                <div className="text-right min-w-[60px]">
                                  <div className="text-xl font-bold text-white">
                                    {percentage.toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    do total
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div
                            className={`absolute inset-0 bg-linear-to-r ${level.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                          />
                        </button>

                        {/* Detail Panel */}
                        {isSelected && (
                          <div className="mt-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <div className="text-2xl font-bold text-white">
                                  {level.count}
                                </div>
                                <div className="text-xs text-slate-400">
                                  Flashcards
                                </div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-white">
                                  {percentage.toFixed(1)}%
                                </div>
                                <div className="text-xs text-slate-400">
                                  Distribuição
                                </div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-white">
                                  {maxCount === level.count
                                    ? "👑"
                                    : `${(
                                        (level.count / maxCount) *
                                        100
                                      ).toFixed(0)}%`}
                                </div>
                                <div className="text-xs text-slate-400">
                                  vs Máximo
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Chart Section */}
            <div className=" h-max bg-slate-800/30 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                📊 Distribuição Visual
              </h3>
              <ResponsiveContainer width="100%" height={isDesktop ? 488 : 220}>
                <BarChart data={enrichedData}>
                  <XAxis dataKey="label" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value) => [
                      <p className="text-white">{value} cards, Quantidade</p>,
                    ]}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {enrichedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-violet-500/20 to-purple-600/20 rounded-lg p-4 border border-violet-500/30">
              <div className="text-sm text-slate-400">Nível Dominante</div>
              <div className="text-xl font-bold text-white mt-1">
                {enrichedData[0].icon} {enrichedData[0].label}
              </div>
            </div>
            <div className="bg-linear-to-br from-emerald-500/20 to-green-600/20 rounded-lg p-4 border border-emerald-500/30">
              <div className="text-sm text-slate-400">Média por Nível</div>
              <div className="text-xl font-bold text-white mt-1">
                {(totalCards / enrichedData.length).toFixed(1)} cards
              </div>
            </div>
            <div className="bg-linear-to-br from-amber-500/20 to-orange-600/20 rounded-lg p-4 border border-amber-500/30">
              <div className="text-sm text-slate-400">Foco Sugerido</div>
              <div className="text-xl font-bold text-white mt-1">
                {enrichedData[enrichedData.length - 1].icon}{" "}
                {enrichedData[enrichedData.length - 1].label}
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">
          Nenhum registro até o momento, começe a usar a plataforma para
          exibirmos seus dados!
        </p>
      )}
    </div>
  );
};
