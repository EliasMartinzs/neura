import { StudiedCategory } from "@/utils/type";
import { Crown, Flame, Hash, Sparkles, Star, Zap } from "lucide-react";
import { memo, useMemo, useState } from "react";

const colors = [
  {
    main: "#fbbf24",
    gradient: "from-yellow-400 to-orange-500",
    glow: "rgba(251, 191, 36, 0.4)",
  },
  {
    main: "#a78bfa",
    gradient: "from-purple-400 to-pink-500",
    glow: "rgba(167, 139, 250, 0.4)",
  },
  {
    main: "#60a5fa",
    gradient: "from-blue-400 to-cyan-500",
    glow: "rgba(96, 165, 250, 0.4)",
  },
  {
    main: "#34d399",
    gradient: "from-emerald-400 to-teal-500",
    glow: "rgba(52, 211, 153, 0.4)",
  },
  {
    main: "#f472b6",
    gradient: "from-pink-400 to-rose-500",
    glow: "rgba(244, 114, 182, 0.4)",
  },
  {
    main: "#818cf8",
    gradient: "from-indigo-400 to-purple-500",
    glow: "rgba(129, 140, 248, 0.4)",
  },
  {
    main: "#fb923c",
    gradient: "from-orange-400 to-red-500",
    glow: "rgba(251, 146, 60, 0.4)",
  },
  {
    main: "#22d3ee",
    gradient: "from-cyan-400 to-blue-500",
    glow: "rgba(34, 211, 238, 0.4)",
  },
  {
    main: "#a3e635",
    gradient: "from-lime-400 to-green-500",
    glow: "rgba(163, 230, 53, 0.4)",
  },
  {
    main: "#c084fc",
    gradient: "from-violet-400 to-fuchsia-500",
    glow: "rgba(192, 132, 252, 0.4)",
  },
];

type Props = {
  topTags: StudiedCategory[];
};

export function TopTagsWidgetComponent({ topTags }: Props) {
  const [selectedTag, setSelectedTag] = useState<number>(0);

  if (!topTags) {
    return null;
  }

  const tags = useMemo(() => {
    return topTags.map((item) => ({
      tag: item.tag || item,
      count: item.count || 0,
    }));
  }, [topTags]);

  if (!tags.length) {
    return null;
  }

  const maxCount = Math.max(...tags.map((tag) => tag.count), 1);
  const currentTag = tags[selectedTag];
  const currentColor = colors[selectedTag];

  console.log(tags);

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-2xl">
        {/* Efeitos de fundo dinâmicos */}
        <>
          <div
            className="absolute inset-0 transition-all duration-700 blur-3xl"
            style={{
              background: `radial-linear(circle at 30% 50%, ${currentColor.glow}, transparent 70%)`,
            }}
          />
          <div
            className="absolute inset-0 transition-all duration-700 blur-3xl"
            style={{
              background: `radial-linear(circle at 70% 50%, ${currentColor.glow}, transparent 70%)`,
            }}
          />
        </>

        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-3 border border-purple-500/30 backdrop-blur-sm">
              <Flame className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-linear-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Tags
              </h2>
              <p className="text-slate-400 text-sm">
                Explore suas tags mais populares
              </p>
            </div>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse ml-auto" />
          </div>
        </div>

        {/* Layout principal */}

        <div className="grid lg:grid-cols-2 gap-y-8 p-6">
          {/* Lado esquerdo */}
          <div className="flex items-center justify-center">
            <div className="relative w-full">
              {/* Centro - Tag selecionada */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* Círculo de fundo pulsante */}
                  <div
                    className="rounded-full blur-2xl animate-pulse transition-all duration-700"
                    style={{
                      background: `radial-linear(circle, ${currentColor.glow}, transparent)`,
                      transform: "scale(1.5)",
                    }}
                  />

                  {/* Card central */}
                  <div
                    className="relative z-10 rounded-3xl border-2 backdrop-blur-xl shadow-2xl p-8 transition-all duration-500 max-w-xs"
                    style={{
                      borderColor: currentColor.main,
                      background: `linear-linear(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))`,
                    }}
                  >
                    <div className="text-center space-y-4">
                      {/* Ícone */}
                      <div className="flex justify-center">
                        {selectedTag === 0 ? (
                          <Crown className="w-16 h-16 text-yellow-400 animate-bounce" />
                        ) : selectedTag === 1 ? (
                          <Star className="w-16 h-16 text-purple-400 animate-pulse" />
                        ) : (
                          <Hash
                            className="w-16 h-16 transition-all duration-500"
                            style={{ color: currentColor.main }}
                          />
                        )}
                      </div>

                      {/* Nome da tag */}
                      <div>
                        <div className="text-sm text-slate-400 font-medium mb-1">
                          #{selectedTag + 1} Mais Usada
                        </div>
                        <h3 className="text-4xl font-extrabold text-white mb-2">
                          {String(currentTag.tag).slice(0, 5)}
                        </h3>
                      </div>

                      {/* Contador */}
                      <div className="relative">
                        <div
                          className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                          style={{ backgroundColor: currentColor.main }}
                        />
                        <div
                          className="relative rounded-2xl p-4 backdrop-blur-sm"
                          style={{
                            background: `linear-linear(135deg, ${currentColor.main}20, ${currentColor.main}10)`,
                            borderColor: currentColor.main,
                            borderWidth: "1px",
                          }}
                        >
                          <div className="text-6xl font-extrabold text-white">
                            {currentTag?.count}
                          </div>
                          <div className="text-sm font-semibold text-slate-300 mt-1">
                            utilizações
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito: Lista compacta */}
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Ranking Completo</h3>
            </div>

            <div className="space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50 max-h-96 overflow-auto">
              {!tags.length ? (
                <p>Suas tags mais usadao aparecerão aqui</p>
              ) : (
                tags.map((tag, index) => {
                  const color = colors[index];
                  const isSelected = selectedTag === index;

                  return (
                    <button
                      key={tag.tag as string}
                      onClick={() => setSelectedTag(index)}
                      className="w-full text-left duration-300 focus:outline-none group"
                      style={{
                        animation: `slideInRight 0.5s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <div
                        className="rounded-xl p-4 backdrop-blur-sm duration-300 border-2 overflow-auto group-hover:translate-y-1 group-hover:shadow-2xl"
                        style={{
                          backgroundColor: isSelected
                            ? `${color.main}20`
                            : "rgba(30, 41, 59, 0.3)",
                          borderColor: isSelected
                            ? color.main
                            : "rgba(71, 85, 105, 0.3)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-4">
                          {/* Posição + Nome */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300"
                              style={{
                                backgroundColor: `${color.main}30`,
                                color: color.main,
                                transform: isSelected
                                  ? "scale(1.1) rotate(5deg)"
                                  : "scale(1)",
                              }}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-white truncate">
                                {tag.tag as string}
                              </div>
                              <div className="text-xs text-slate-400">
                                {tag.count} utilizações
                              </div>
                            </div>
                          </div>

                          {/* Porcentagem */}
                          <div
                            className="text-right font-bold text-lg shrink-0"
                            style={{ color: color.main }}
                          >
                            {((tag.count / maxCount) * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative p-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span>Clique nos números para explorar</span>
            </div>
            <div className="text-slate-400">
              Total:{" "}
              <span className="text-white font-bold">
                {tags.reduce((acc, tag) => acc + tag.count, 0)}
              </span>{" "}
              usos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const TopTagsWidget = memo(TopTagsWidgetComponent);
TopTagsWidget.displayName = "TopTagsWidget";
