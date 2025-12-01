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
    <div className="backdrop-blur-sm overflow-hidden dark:bg-none bg-linear-to-br from-slate-700 via-slate-600 to-slate-700 border rounded-4xl py-6 text-white">
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{bloomLevel.icon}</span>
          <div>
            <h3 className="text-sm font-semibold ">{bloomLevel.label}</h3>
            <p className="text-xs">{bloomLevel.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
