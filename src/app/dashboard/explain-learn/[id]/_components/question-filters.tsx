import { OpenStudyStatus } from "@prisma/client";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { memo } from "react";
import { CreateExplainQuestionButton } from "../../_components/create-explain-button";
import { OpenExplainDocumentation } from "../../_components/open-explain-question-documentation";

type Props = {
  filter: "ALL" | OpenStudyStatus;
  handleFilter: (filter: OpenStudyStatus) => void;
};

const FILTER_OPTIONS = [
  {
    key: null,
    label: "Todos",
    icon: BookOpen,
    gradient: "from-slate-600 to-slate-700",
  },
  {
    key: "COMPLETED" as const,
    label: "Completados",
    icon: CheckCircle2,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    key: "PENDING" as const,
    label: "Pendentes",
    icon: Clock,
    gradient: "from-amber-600 to-orange-600",
  },
];

const QuestionFiltersComponent = ({ filter, handleFilter }: Props) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex flex-wrap gap-6 mb-8">
        {FILTER_OPTIONS.map(({ key, label, icon: Icon, gradient }) => (
          <button
            key={key}
            onClick={() => handleFilter(key as OpenStudyStatus)}
            className={`group relative overflow-hidden px-6 py-3.5 rounded-2xl font-bold transition-all transform hover:scale-105 ${
              filter === key ? "scale-105 text-white" : ""
            }`}
          >
            {filter === key && (
              <div
                className={`absolute inset-0 bg-linear-to-r ${gradient} shadow-2xl`}
              ></div>
            )}
            <div className="relative flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {label}
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center">
        <OpenExplainDocumentation />

        <CreateExplainQuestionButton />
      </div>
    </div>
  );
};

export const QuestionFilters = memo(QuestionFiltersComponent);
QuestionFilters.displayName = "QuestionName";
