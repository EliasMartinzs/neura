import { ResponseGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import { LucideIcon } from "lucide-react";
import { memo } from "react";
import { QuestionItem } from "./question-item";

type FilteredSesion = ResponseGetExplainQuestions["data"];

type Props = {
  filteredSessions: FilteredSesion;
  explainUI: {
    showInput: boolean;
    setShowInput: (prev: boolean) => void;
    expandedId: string | null;
    setExpandedId: (prev: string | null) => void;
    getDifficultyConfig: (difficulty: any) => {
      bg: string;
      text: string;
      glow: string;
      icon: LucideIcon;
    };
    getScoreConfig: (score: number) => {
      color: string;
      label: string;
      icon: LucideIcon;
    };
    formatDate: (dateString: any) => string;
  };
};

const QuestionListComponent = ({ filteredSessions, explainUI }: Props) => {
  return (
    <div className="space-y-6">
      {filteredSessions?.map((session) => {
        return (
          <QuestionItem
            key={session.id}
            session={session}
            explainUI={explainUI}
          />
        );
      })}
    </div>
  );
};

export const QuestionList = memo(QuestionListComponent);
QuestionList.displayName = "QuestionList";
