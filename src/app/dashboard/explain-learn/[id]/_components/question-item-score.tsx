import { LucideIcon } from "lucide-react";

type Props = {
  scoreConfig: {
    color: string;
    label: string;
    icon: LucideIcon;
  } | null;
  IconScore: LucideIcon | undefined;
  score: number;
};

export const QuestionItemScore = ({ IconScore, scoreConfig, score }: Props) => {
  return (
    <div className="relative group/item">
      <div className="relative bg-slate-800 rounded-4xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 bg-linear-to-br ${scoreConfig?.color} rounded-xl shadow-lg`}
            >
              {IconScore && <IconScore />}
            </div>
            <div>
              <h4 className="font-black text-white text-lg">Pontuação</h4>
              <p className="text-slate-400 text-sm">{scoreConfig?.label}</p>
            </div>
          </div>
          <span
            className={`text-5xl font-black text-transparent bg-clip-text bg-linear-to-r ${scoreConfig?.color}`}
          >
            {score}%
          </span>
        </div>
        <div className="relative w-full h-4 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 bg-linear-to-r ${scoreConfig?.color} rounded-full shadow-lg transition-all duration-1000 ease-out`}
            style={{
              width: `${score}%`,
            }}
          >
            <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
