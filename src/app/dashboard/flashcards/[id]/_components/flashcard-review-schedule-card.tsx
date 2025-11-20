import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Zap } from "lucide-react";

export const FlashcardReviewScheduleCard = ({
  interval,
  lastReviewDate,
  nextReviewDate,
  repetition,
}: {
  lastReviewDate: {
    text: string;
    relative: string;
  };
  nextReviewDate: {
    text: string;
    relative: string;
  };
  interval: number;
  repetition: number;
}) => {
  return (
    <Card className="backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Cronograma
        </h3>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border-primary border">
            <Clock className="w-5 h-5 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium ">Última Revisão</p>
              <p className="text-xs truncate">{lastReviewDate.text}</p>
              {lastReviewDate.relative && (
                <Badge className="mt-1 border-0 text-xs">
                  {lastReviewDate.relative}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 text-white bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-sm rounded-lg">
            <Zap className="w-5 h-5 text-primary-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Próxima Revisão</p>
              <p className="text-xs truncate">{nextReviewDate.text}</p>
              {nextReviewDate.relative && (
                <Badge className="mt-1 border text-primary bg-primary-foreground text-xs">
                  {nextReviewDate.relative}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-sm text-muted-foreground">Intervalo</span>
            <span className="text-lg font-bold ">{interval} dias</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <span className="text-sm text-muted-foreground">Repetições</span>
            <span className="text-lg font-bold ">{repetition}x</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
