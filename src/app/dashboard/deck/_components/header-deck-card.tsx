import { memo } from "react";

const HeaderDeckCardComponent = ({
  name,
  description,
}: {
  name: string;
  description: string | null;
}) => {
  return (
    <div className="relative pt-20 px-6 pb-4">
      <div className=" bg-white/15 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 group/header">
        <h2 className="text-2xl font-bold text-center leading-relaxed capitalize line-clamp-2 group-hover/header:line-clamp-none group-hover/header:scale-105 group-hover/header:z-50 relative transition-all duration-300">
          {name}
        </h2>
        {description && (
          <p className="text-sm text-center mt-3 leading-relaxed line-clamp-2 group-hover/header:line-clamp-none">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
export const HeaderDeckCard = memo(HeaderDeckCardComponent);
HeaderDeckCard.displayName = "HeaderDeckCard";
