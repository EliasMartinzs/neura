import { Sparkles } from "lucide-react";

type Props = {
  feedback: string;
};

export const QuestionItemFeedback = ({ feedback }: Props) => {
  return (
    <div className="relative group/item">
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 rounded-4xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
      <div className="relative bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-4xl p-5 border border-cyan-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-linear-to-br from-cyan-500 to-blue-500 rounded-lg shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-black text-cyan-300 mb-2 text-lg">
              Feedback da IA
            </h4>
            <p className="text-slate-300 leading-relaxed">{feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
