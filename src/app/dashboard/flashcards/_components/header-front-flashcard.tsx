import { Tooltip } from "@/components/shared/tooltip";
import { getForeground } from "@/constants/circle-colors";
import { memo } from "react";

const HeaderFrontComponent = ({
  color,
  front,
}: {
  front: string;
  color: string | null;
}) => {
  return (
    <Tooltip
      trigger={
        <div className="relative pt-20 px-6 pb-4">
          <div className="bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300">
            <h2 className=" text-xl font-bold text-center leading-relaxed capitalize line-clamp-1">
              {front}
            </h2>
          </div>
        </div>
      }
      content={front}
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textAlign: "center",
        color: getForeground(color || ""),
      }}
    />
  );
};

export const HeaderFrontFlashcard = memo(HeaderFrontComponent);
HeaderFrontFlashcard.displayName = "HeaderFrontFlashcard";
