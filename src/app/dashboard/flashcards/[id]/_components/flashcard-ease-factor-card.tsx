import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Brain, LucideIcon } from "lucide-react";

export const FlashcardEaseFactorCard = ({
  easeInfo,
  easeFactor,
}: {
  easeInfo: {
    label: string;
    color: string;
    icon: LucideIcon;
  };
  easeFactor: number;
}) => {
  const Icon = easeInfo.icon;
  return (
    <Card className="backdrop-blur-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold  flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Facilidade
          </h3>
          <span className="text-2xl">
            <Icon />
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold ">{easeFactor}</span>
            <span className="text-lg text-muted-foreground mb-1">/4.0</span>
          </div>
          <Badge className={`${easeInfo.color} bg-white/10 border-0`}>
            {easeInfo.label}
          </Badge>
          <p className="text-xs text-muted-foreground">
            Indica como você retém este conteúdo. Maior = mais fácil de lembrar.
          </p>
        </div>
      </div>
    </Card>
  );
};
