import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import {
  Activity,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";

export const DeckStats = ({
  expandedStats,
  setExpandedStats,
  totalCards,
  reviewCount,
  accuracyRate,
  averageGrade,
}: {
  setExpandedStats: (prev: boolean) => void;
  expandedStats: boolean;
  totalCards: number;
  reviewCount: number | null;
  accuracyRate: number;
  averageGrade: number;
}) => {
  return (
    <>
      <button
        onClick={() => setExpandedStats(!expandedStats)}
        className="flex items-center gap-3 hover:transition-all mb-6 group px-4 py-2 rounded-xl hover:bg-white/5"
      >
        <BarChart3 className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xl">Estatísticas e Performance</span>
        <div
          className={`transition-transform duration-300 ${
            expandedStats ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {expandedStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7 text-blue-700 dark:text-blue-300" />
                </div>
                <Sparkles className="w-5 h-5 text-blue-700 dark:text-blue-300 animate-pulse" />
              </div>
              <div className="text-5xl font-black mb-2 ">{totalCards}</div>
              <div className="text-blue-700 dark:text-blue-300/80 text-sm font-semibold uppercase tracking-wide">
                Total de Cards
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-blue-500/50 to-cyan-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-purple-500/30 to-pink-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Activity className="w-7 h-7 text-purple-700 dark:text-purple-300" />
                </div>
                <Trophy className="w-5 h-5 text-purple-700 dark:text-purple-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">{reviewCount}</div>
              <div className="text-purple-700 dark:text-purple-300/80 text-sm font-semibold uppercase tracking-wide">
                Revisões Feitas
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-purple-500/50 to-pink-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-green-700 dark:text-green-300" />
                </div>
                <Award className="w-5 h-5 text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(accuracyRate * 100)}
                %
              </div>
              <div className="text-green-700 dark:text-green-300/80 text-sm font-semibold uppercase tracking-wide">
                Taxa de Acerto
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-green-500/50 to-emerald-500/50 rounded-full"></div>
            </div>
          </div>

          <div className="relative group cursor-pointer">
            <div className="relative border shadow rounded-2xl p-6 transform transition-transform duration-300 group-hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-xl group-hover:scale-110 transition-transform">
                  <Brain className="w-7 h-7 text-yellow-700 dark:text-yellow-300" />
                </div>
                <Zap className="w-5 h-5 text-yellow-700 dark:text-yellow-300 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="text-5xl font-black mb-2 ">
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(averageGrade)}
              </div>
              <div className="text-yellow-700 dark:text-yellow-300/80 text-sm font-semibold uppercase tracking-wide">
                Performance Média
              </div>
              <div className="mt-3 h-1 bg-linear-to-r from-yellow-500/50 to-orange-500/50 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
