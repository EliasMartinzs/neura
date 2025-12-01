import { BookOpen, Calendar } from "lucide-react";
import { memo } from "react";

const FooterComponent = ({
  createdAt,
  name,
}: {
  createdAt: string;
  name: string | undefined;
}) => {
  return (
    <div className="relative px-6 pb-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="flex items-center justify-between /90 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">
              {new Date(createdAt).toLocaleDateString("pt-BR")}
            </span>
          </div>

          {name && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full min-w-0 max-w-[60%]">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="text-xs font-medium truncate">{name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const FooterFlashcard = memo(FooterComponent);
FooterFlashcard.displayName = "FooterFlashcard";
