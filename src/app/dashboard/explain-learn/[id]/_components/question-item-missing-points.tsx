import { Target } from "lucide-react";

type Props = {
  missingPoints: string;
};

export const QuestionItemMissingPoints = ({ missingPoints }: Props) => {
  return (
    <div className="relative group/item">
      <div className="absolute inset-0 bg-linear-to-r from-orange-500 to-amber-500 rounded-4xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
      <div className="relative bg-linear-to-br from-orange-500/10 to-amber-500/10 rounded-4xl p-5 border border-orange-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-linear-to-br from-orange-500 to-amber-500 rounded-lg shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-black text-orange-300 mb-2 text-lg">
              Pontos para Evoluir
            </h4>
            <p className="text-slate-300 leading-relaxed">{missingPoints}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
