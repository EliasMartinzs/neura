import { Flame, Zap } from "lucide-react";

export const ScoreBadges = ({
  correctCount,
  wrongCount,
}: {
  correctCount: number;
  wrongCount: number;
}) => {
  return (
    <div className="flex gap-4">
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl px-6 py-3 flex items-center gap-3">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="text-2xl font-bold text-white">{correctCount}</span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-rose-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-rose-500/30 rounded-2xl px-6 py-3 flex items-center gap-3">
          <Flame className="w-5 h-5 text-rose-400" />
          <span className="text-2xl font-bold text-white">{wrongCount}</span>
        </div>
      </div>
    </div>
  );
};
