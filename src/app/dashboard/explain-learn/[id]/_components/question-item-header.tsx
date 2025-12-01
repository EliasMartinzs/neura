import { useDeleteExplainQuestion } from "@/features/explain-learn/api/use-delete-answer-explain-question";
import { ResponseGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  LucideIcon,
  Trash2,
} from "lucide-react";

type Session = NonNullable<ResponseGetExplainQuestions["data"]>[number];

type Props = {
  toggleExpanded: () => void;
  handleShowInput: () => void;
  session: Session;
  diffConfig: {
    bg: string;
    text: string;
    glow: string;
    icon: LucideIcon;
  };
  IconDiff: LucideIcon;
  scoreConfig: {
    color: string;
    label: string;
    icon: LucideIcon;
  } | null;
  IconScore: LucideIcon | undefined;
  isExpanded: boolean;
  formatDate: (dateString: any) => string;
};

export const QuestionItemHeader = ({
  toggleExpanded,
  handleShowInput,
  session,
  IconDiff,
  diffConfig,
  formatDate,
  scoreConfig,
  IconScore,
  isExpanded,
}: Props) => {
  const { mutate, isPending } = useDeleteExplainQuestion();

  const handleDelete = () => {
    mutate({ id: session.id });
  };

  return (
    <div
      className="p-6 cursor-pointer hover:bg-slate-700/30 transition-color"
      onClick={() => {
        handleShowInput();
      }}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon */}
        <div
          className={`relative shrink-0 p-4 rounded-2xl ${
            session.completedAt
              ? "bg-linear-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50"
              : "bg-linear-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/50"
          }`}
        >
          {session.completedAt ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <Clock className="w-7 h-7 text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-2xl font-black text-white">
                {session.topic}
              </h3>
              {session.question?.difficulty && (
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-linear-to-r ${diffConfig.bg} shadow-lg ${diffConfig.glow}`}
                >
                  <IconDiff />
                  {diffConfig.text}
                </span>
              )}
            </div>
          </div>

          <p className="text-slate-300 mb-4 line-clamp-2 text-lg">
            {session.question?.content}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">
                {formatDate(session.createdAt)}
              </span>
            </div>

            {session.attempt && (
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r ${scoreConfig?.color} shadow-lg`}
                >
                  {IconScore && <IconScore />}
                  <span className="font-black text-white text-lg">
                    {session.attempt.score}%
                  </span>
                </div>
                <span className="text-sm font-bold text-white">
                  {scoreConfig?.label}
                </span>
              </div>
            )}

            {!session.attempt && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-orange-500 shadow-lg">
                <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                <span className="font-bold text-white text-sm">
                  Continue Estudando
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Expand Button */}
        <div className="flex items-center gap-x-3">
          <button
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="text-slate-300 size-5" />
          </button>
          <button
            className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
            onClick={toggleExpanded}
          >
            {isExpanded ? (
              <ChevronUp className="text-slate-300 size-5" />
            ) : (
              <ChevronDown className="text-slate-300 size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
