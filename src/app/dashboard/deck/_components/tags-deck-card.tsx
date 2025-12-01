import { Eye, EyeOff, Tag } from "lucide-react";
import { memo } from "react";

const TagsDeckCardComponent = ({
  displayedTags,
  hasMoreTags,
  toggleTags,
  showAllTags,
  tags,
}: {
  tags: string[];
  displayedTags: string[];
  hasMoreTags: boolean;
  showAllTags: boolean;
  toggleTags: () => void;
}) => {
  return (
    <>
      {tags.length > 0 ? (
        <div className="relative px-6 py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 " />
              <span className=" text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayedTags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-xs font-medium hover:bg-white/30 transition-all duration-200"
                >
                  {tag}
                </div>
              ))}
              {hasMoreTags && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTags();
                  }}
                  className="px-3 py-1.5 bg-white/30 backdrop-blur-sm rounded-full border border-white/40 text-xs font-medium hover:bg-white/40 transition-all duration-200 flex items-center gap-1.5"
                >
                  {showAllTags ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />+{tags.length - 4}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative px-6 py-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 " />
              <span className=" text-sm font-medium">Tags</span>
            </div>
            <span>Nenhuma tag adicionada</span>
          </div>
        </div>
      )}
    </>
  );
};

export const TagsDeckCard = memo(TagsDeckCardComponent);
TagsDeckCard.displayName = "TagsDeckCard";
