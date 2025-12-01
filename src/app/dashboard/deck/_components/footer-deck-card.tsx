import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

const FooterDeckCardComponent = ({
  createdAt,
  id,
}: {
  createdAt: string;
  id: string;
}) => {
  return (
    <div className="relative px-6 pb-6 flex items-center gap-5">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex-1">
        <div className="flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            Criado em {new Date(createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </div>
      <Link
        href={`/dashboard/deck/${id}`}
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 flex-1 group/icon hover:scale-105 transition-transform duration-700 ease-initial"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-medium">Estudar</span>
          <ArrowRight className="group-hover/icon:translate-x-2 transition-transform duration-700 ease-initial" />
        </div>
      </Link>
    </div>
  );
};

export const FooterDeckCard = memo(FooterDeckCardComponent);
FooterDeckCard.displayName = "FooterDeckCard";
