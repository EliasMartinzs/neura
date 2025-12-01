import { memo } from "react";

const DecorativesAndAnimationsComponent = ({
  color,
}: {
  color: string | null;
}) => (
  <>
    <div
      className="absolute -inset-1 rounded-2xl blur-xl opacity-0 hover:opacity-50 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 -z-10"
      style={{
        background:
          color || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    ></div>
    <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-br-full"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-black/10 rounded-tl-full"></div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "0s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "1s", animationDuration: "3s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-white/30 rounded-full animate-ping"
        style={{ animationDelay: "2s", animationDuration: "3s" }}
      ></div>
    </div>
  </>
);

export const DecorativesAndAnimations = memo(DecorativesAndAnimationsComponent);
DecorativesAndAnimations.displayName = "DecorativesAndAnimations";
