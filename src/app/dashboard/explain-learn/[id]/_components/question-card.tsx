import { BookOpen } from "lucide-react";

import { ResponseGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import { useExplainUI } from "@/features/explain-learn/hooks/use-explain-ui";
import { memo } from "react";
import { QuestionList } from "./question-list";

type Data = ResponseGetExplainQuestions["data"];

type Props = {
  data: Data;
};

const QuestionCardComponent = ({ data }: Props) => {
  const explainUI = useExplainUI();

  return (
    <div>
      <QuestionList filteredSessions={data} explainUI={explainUI} />

      {data?.length === 0 && (
        <div className="relative group">
          <div className="relative bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 dark:bg-none backdrop-blur-3xl rounded-4xl p-16 text-center border">
            <div className="inline-flex p-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-4xl mb-6">
              <BookOpen className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">
              Nenhum estudo encontrado
            </h3>
            <p className="text-slate-400 text-lg">
              Comece sua jornada de aprendizado agora mesmo!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const QuestionCard = memo(QuestionCardComponent);
QuestionCard.displayName = "Question Card";
