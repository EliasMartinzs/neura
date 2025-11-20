import { Card } from "@/components/ui/card";

export const FlashcardBloomLevelCard = ({
  bloomLevel,
}: {
  bloomLevel: {
    label: string;
    icon: string;
    description: string;
  };
}) => {
  return (
    <Card className="bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 text-white backdrop-blur-sm">
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bloomLevel.icon}</span>
          <div>
            <h3 className="text-sm font-semibold ">{bloomLevel.label}</h3>
            <p className="text-xs">{bloomLevel.description}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
