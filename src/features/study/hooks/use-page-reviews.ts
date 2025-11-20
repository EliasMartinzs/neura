import { useCallback, useMemo } from "react";
import { AlertCircle, Calendar, CheckCircle2, Flame } from "lucide-react";
import { ResponseUseGetReviews } from "../api/use-get-reviews";

type Flashcard = NonNullable<ResponseUseGetReviews>["data"];

type Props = {
  data: Flashcard;
};

export const usePageReviews = ({ data }: Props) => {
  const now = useMemo(() => new Date(), []);

  const formatTime = useCallback((date: string) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const formatDate = useCallback((date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Hoje";
    if (d.toDateString() === tomorrow.toDateString()) return "Amanhã";

    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    });
  }, []);

  const getDaysUntil = useCallback(
    (date: string) => {
      const diff = new Date(date).getTime() - now.getTime();
      return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },
    [now]
  );

  const columns = useMemo(
    () => [
      {
        id: "urgent",
        title: "Urgente",
        subtitle: "Revisar agora",
        icon: AlertCircle,
        count: data?.urgent.length || 0,
        cards: data?.urgent,
        gradient: "from-red-500 via-rose-500 to-pink-500",
        bgGradient: "from-red-500/70 to-pink-500/70",
        glowColor: "rgba(239, 68, 68, 0.3)",
        iconColor: "text-red-200",
        countBg: "bg-red-500/70",
        countBorder: "border-red-500/30",
        countText: "text-white",
      },
      {
        id: "today",
        title: "Hoje",
        subtitle: "Programado para hoje",
        icon: Flame,
        count: data?.today.length || 0,
        cards: data?.today,
        gradient: "from-orange-500 via-amber-500 to-yellow-500",
        bgGradient: "from-orange-500/70 to-yellow-500/70",
        glowColor: "rgba(249, 115, 22, 0.3)",
        iconColor: "text-orange-200",
        countBg: "bg-orange-500/70",
        countBorder: "border-orange-500/30",
        countText: "text-white",
      },
      {
        id: "upcoming",
        title: "Próximas",
        subtitle: "Nos próximos dias",
        icon: Calendar,
        count: data?.upcoming.length || 0,
        cards: data?.upcoming,
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        bgGradient: "from-blue-500/70 to-teal-500/70",
        glowColor: "rgba(59, 130, 246, 0.3)",
        iconColor: "text-blue-200",
        countBg: "bg-blue-500/70",
        countBorder: "border-blue-500/30",
        countText: "text-white",
      },
      {
        id: "completed",
        title: "Concluídas",
        subtitle: "Revisões feitas",
        icon: CheckCircle2,
        count: data?.completed.length || 0,
        cards: data?.completed,
        gradient: "from-emerald-500 via-green-500 to-teal-500",
        bgGradient: "from-emerald-500/70 to-teal-500/70",
        glowColor: "rgba(16, 185, 129, 0.3)",
        iconColor: "text-emerald-200",
        countBg: "bg-emerald-500/70",
        countBorder: "border-emerald-500/30",
        countText: "text-white",
      },
    ],
    [data]
  );

  return {
    formatTime,
    formatDate,
    getDaysUntil,
    columns,
  };
};
