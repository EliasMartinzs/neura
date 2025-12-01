import { ResponseGetExplainQuestions } from "@/features/explain-learn/api/use-get-explain-questions";
import { Brain, LucideIcon, Zap } from "lucide-react";
import { memo, useCallback } from "react";
import { QuestionItemFeedback } from "./question-item-feedback";
import { QuestionItemForm } from "./question-item-form";
import { QuestionItemHeader } from "./question-item-header";
import { QuestionItemMissingPoints } from "./question-item-missing-points";
import { QuestionItemScore } from "./question-item-score";

type Session = NonNullable<ResponseGetExplainQuestions["data"]>[number];

type Props = {
  session: Session;
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

const QuestionItemComponent = ({ session, explainUI }: Props) => {
  const {
    expandedId,
    formatDate,
    getDifficultyConfig,
    getScoreConfig,
    setExpandedId,
    setShowInput,
    showInput,
  } = explainUI;

  const diffConfig = getDifficultyConfig(session.question?.difficulty);
  const { icon: IconDiff } = diffConfig;

  const scoreConfig = session.attempt
    ? getScoreConfig(session.attempt.score)
    : null;
  const IconScore = scoreConfig?.icon;

  const isExpanded = expandedId === session.id;

  const toggleExpanded = useCallback(() => {
    setExpandedId(isExpanded ? null : session.id);
  }, [isExpanded, session.id, setExpandedId]);

  const handleShowInput = useCallback(() => {
    setShowInput(true);
  }, [setShowInput]);

  return (
    <div className="group relative">
      <div className="relative bg-linear-to-br from-slate-700 via-slate-600 to-slate-800 dark:bg-none backdrop-blur-xl rounded-4xl border overflow-hidden shadow-2xl hover:shadow-2xl transition-all">
        {/* Header Clickable */}
        <QuestionItemHeader
          IconDiff={IconDiff}
          IconScore={IconScore}
          diffConfig={diffConfig}
          formatDate={formatDate}
          toggleExpanded={toggleExpanded}
          handleShowInput={handleShowInput}
          isExpanded={isExpanded}
          scoreConfig={scoreConfig}
          session={session}
        />

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t bg-slate-900/50 dark:bg-transparent p-6 space-y-6">
            <div className="relative group/item">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500/70 to-purple-500/70 rounded-4xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
              <div className="relative bg-slate-800 rounded-4xl p-5 border border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-linear-to-br from-indigo-500/70 to-purple-500/70 rounded-4xl">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-black text-white text-lg">Pergunta</h4>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {session.question?.content}
                </p>
              </div>
            </div>

            {session.attempt && (
              <>
                <div className="relative group/item">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500/70 to-cyan-500/70 rounded-4xl blur-xl opacity-20 group-hover/item:opacity-30 transition-opacity"></div>
                  <div className="relative bg-slate-800 rounded-4xl p-5 border border-slate-700">
                    <h4 className="font-black text-white mb-3 text-lg">
                      Sua Resposta
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      {session.attempt.userAnswer}
                    </p>
                  </div>
                </div>

                <QuestionItemScore
                  IconScore={IconScore}
                  scoreConfig={scoreConfig}
                  score={session.attempt.score}
                />

                {/* Feedback */}
                <QuestionItemFeedback feedback={session.attempt.feedback} />

                {session.attempt.missingPoints && (
                  <QuestionItemMissingPoints
                    missingPoints={session.attempt.missingPoints}
                  />
                )}
              </>
            )}

            {!session.attempt && !showInput && (
              <div
                className="relative group/item cursor-pointer"
                onClick={handleShowInput}
              >
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/70 to-pink-500/70 rounded-4xl blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-4xl p-8 border-2 border-purple-500/50 text-center">
                  <div className="inline-flex p-4 bg-linear-to-br from-purple-500 to-pink-500 rounded-4xl shadow-2xl mb-4">
                    <Brain className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-2xl font-black text-white mb-2">
                    Pronto para o Desafio?
                  </h4>
                  <p className="text-purple-200 font-medium">
                    CLique para responder!
                  </p>
                </div>
              </div>
            )}

            <QuestionItemForm
              attempt={!session.attempt}
              showInput={showInput}
              question={session.question}
              sessionId={session.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const QuestionItem = memo(QuestionItemComponent);
QuestionItem.displayName = "QuestionItem";
