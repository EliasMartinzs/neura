import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  Zap,
  Target,
  Award,
  Brain,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";

type Flashcard = {
  id: string;
  front: string;
  topic?: string;
  subtopic?: string;
  difficulty?: string;
  bloomLevel?: string;
  color?: string;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview?: Date;
  lastReviewedAt?: Date;
  performanceAvg?: number;
};

type Props = {
  flashcards: Flashcard[];
};

export function ReviewCalendarV2({ flashcards }: Props) {
  const [animated, setAnimated] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    "urgent" | "today" | "upcoming" | "completed"
  >("urgent");

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const now = new Date();

  // Classificar cards
  const urgentCards = flashcards
    .filter((card) => card.nextReview && new Date(card.nextReview) < now)
    .sort(
      (a, b) =>
        new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime()
    );

  const todayCards = flashcards.filter((card) => {
    if (!card.nextReview) return false;
    const reviewDate = new Date(card.nextReview);
    return reviewDate.toDateString() === now.toDateString();
  });

  const upcomingCards = flashcards
    .filter(
      (card) =>
        card.nextReview &&
        new Date(card.nextReview) > now &&
        new Date(card.nextReview).toDateString() !== now.toDateString()
    )
    .sort(
      (a, b) =>
        new Date(a.nextReview!).getTime() - new Date(b.nextReview!).getTime()
    );

  const completedCards = flashcards
    .filter((card) => card.lastReviewedAt)
    .sort(
      (a, b) =>
        new Date(b.lastReviewedAt!).getTime() -
        new Date(a.lastReviewedAt!).getTime()
    )
    .slice(0, 10);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Hoje";
    if (d.toDateString() === tomorrow.toDateString()) return "Amanhã";

    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getDaysUntil = (date: Date) => {
    const diff = new Date(date).getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const columns = [
    {
      id: "urgent",
      title: "Urgente",
      subtitle: "Revisar agora",
      icon: AlertCircle,
      count: urgentCards.length,
      cards: urgentCards,
      gradient: "from-red-500 via-rose-500 to-pink-500",
      bgGradient: "from-red-500/20 to-pink-500/20",
      glowColor: "rgba(239, 68, 68, 0.3)",
      iconColor: "text-red-400",
      countBg: "bg-red-500/20",
      countBorder: "border-red-500/30",
      countText: "text-red-400",
    },
    {
      id: "today",
      title: "Hoje",
      subtitle: "Programado para hoje",
      icon: Flame,
      count: todayCards.length,
      cards: todayCards,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient: "from-orange-500/20 to-yellow-500/20",
      glowColor: "rgba(249, 115, 22, 0.3)",
      iconColor: "text-orange-400",
      countBg: "bg-orange-500/20",
      countBorder: "border-orange-500/30",
      countText: "text-orange-400",
    },
    {
      id: "upcoming",
      title: "Próximas",
      subtitle: "Nos próximos dias",
      icon: Calendar,
      count: upcomingCards.length,
      cards: upcomingCards,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/20 to-teal-500/20",
      glowColor: "rgba(59, 130, 246, 0.3)",
      iconColor: "text-blue-400",
      countBg: "bg-blue-500/20",
      countBorder: "border-blue-500/30",
      countText: "text-blue-400",
    },
    {
      id: "completed",
      title: "Concluídas",
      subtitle: "Revisões feitas",
      icon: CheckCircle2,
      count: completedCards.length,
      cards: completedCards,
      gradient: "from-emerald-500 via-green-500 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
      glowColor: "rgba(16, 185, 129, 0.3)",
      iconColor: "text-emerald-400",
      countBg: "bg-emerald-500/20",
      countBorder: "border-emerald-500/30",
      countText: "text-emerald-400",
    },
  ];

  const renderCard = (
    card: Flashcard,
    column: (typeof columns)[0],
    index: number
  ) => {
    const isHovered = hoveredCard === card.id;
    const performance = card.performanceAvg || 0;

    return (
      <div
        key={card.id}
        onMouseEnter={() => setHoveredCard(card.id)}
        onMouseLeave={() => setHoveredCard(null)}
        className="group"
        style={{ animation: `cardSlideIn 0.4s ease-out ${index * 0.05}s both` }}
      >
        <div
          className={`relative rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 cursor-pointer ${
            isHovered ? "shadow-xl" : "shadow-md"
          }`}
        >
          {/* Borda superior colorida */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${column.gradient} rounded-t-2xl`}
          />

          {/* Glow effect no hover */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-30 -z-10"
              style={{ backgroundColor: column.glowColor }}
            />
          )}

          <div className="space-y-3">
            {/* Header do card */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2">
                  {card.front}
                </h4>
                {card.topic && (
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Target className="w-3 h-3" />
                    <span className="truncate">{card.topic}</span>
                  </div>
                )}
              </div>

              {/* Badge de dificuldade */}
              {card.difficulty && (
                <div
                  className={`px-2 py-1 rounded-lg text-xs font-bold ${
                    card.difficulty === "easy"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : card.difficulty === "medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {card.difficulty === "easy"
                    ? "F"
                    : card.difficulty === "medium"
                    ? "M"
                    : "D"}
                </div>
              )}
            </div>

            {/* Informações específicas por coluna */}
            <div className="space-y-2">
              {column.id === "urgent" && card.nextReview && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="font-semibold">
                      {Math.abs(getDaysUntil(card.nextReview))}d atrasado
                    </span>
                  </div>
                  <div className="text-slate-500">
                    {formatTime(card.nextReview)}
                  </div>
                </div>
              )}

              {column.id === "today" && card.nextReview && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-orange-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="font-semibold">Hoje</span>
                  </div>
                  <div className="text-slate-400">
                    {formatTime(card.nextReview)}
                  </div>
                </div>
              )}

              {column.id === "upcoming" && card.nextReview && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-blue-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="font-semibold">
                      {formatDate(card.nextReview)}
                    </span>
                  </div>
                  <div className="text-slate-500">
                    {getDaysUntil(card.nextReview)}d
                  </div>
                </div>
              )}

              {column.id === "completed" && card.lastReviewedAt && (
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold">
                      {formatDate(card.lastReviewedAt)}
                    </span>
                  </div>
                  <div
                    className={`font-bold ${
                      performance >= 70
                        ? "text-emerald-400"
                        : performance >= 50
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {performance.toFixed(0)}%
                  </div>
                </div>
              )}

              {/* Footer com stats */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    <span>{card.repetition}x</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>{card.interval}d</span>
                  </div>
                </div>
                <div className={`text-xs font-semibold ${column.iconColor}`}>
                  EF: {card.easeFactor.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-slate-700/50 backdrop-blur-2xl shadow-2xl">
        {/* Efeitos de fundo animados */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animation: "float 8s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animation: "float 10s ease-in-out infinite reverse" }}
          />
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-3 border border-purple-500/30 backdrop-blur-sm">
                  <Calendar className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <div>
                <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Timeline de Estudos
                </h2>
                <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  Sistema de repetição espaçada em ação
                </p>
              </div>
            </div>

            {/* Total geral */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl px-6 py-3 backdrop-blur-sm">
              <div className="text-slate-400 text-xs font-medium mb-1">
                Total de Cards
              </div>
              <div className="text-4xl font-extrabold text-white">
                {flashcards.length}
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board - Horizontal Scroll */}
        <div className="relative p-6">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
            {columns.map((column, colIndex) => {
              const Icon = column.icon;

              return (
                <div
                  key={column.id}
                  className="flex-shrink-0 w-80"
                  style={{
                    animation: `columnSlideDown 0.6s ease-out ${
                      colIndex * 0.1
                    }s both`,
                  }}
                >
                  {/* Header da coluna */}
                  <div className="sticky top-0 z-10 mb-4">
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${column.bgGradient} border border-slate-700/50 backdrop-blur-xl p-4`}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 opacity-20 blur-2xl"
                        style={{
                          background: `radial-gradient(circle at center, ${column.glowColor}, transparent)`,
                        }}
                      />

                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-xl bg-slate-900/50 ${column.iconColor}`}
                          >
                            <Icon className="w-5 h-5" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">
                              {column.title}
                            </h3>
                            <p className="text-slate-400 text-xs">
                              {column.subtitle}
                            </p>
                          </div>
                        </div>

                        {/* Contador */}
                        <div
                          className={`${column.countBg} ${column.countBorder} border backdrop-blur-sm rounded-xl px-3 py-2 min-w-[60px] text-center`}
                        >
                          <div
                            className={`text-2xl font-extrabold ${column.countText}`}
                          >
                            {column.count}
                          </div>
                        </div>
                      </div>

                      {/* Barra de progresso decorativa */}
                      <div className="mt-3 h-1 bg-slate-900/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${column.gradient} transition-all duration-1000`}
                          style={{
                            width: animated
                              ? `${Math.min(
                                  (column.count / flashcards.length) * 100,
                                  100
                                )}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cards da coluna */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                    {column.cards.length > 0 ? (
                      column.cards.map((card, index) =>
                        renderCard(card, column, index)
                      )
                    ) : (
                      <div className="text-center py-12">
                        <div
                          className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${column.bgGradient} flex items-center justify-center mb-3 opacity-50`}
                        >
                          <Icon className={`w-8 h-8 ${column.iconColor}`} />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                          Nenhum card aqui
                        </p>
                        <p className="text-slate-600 text-xs mt-1">
                          {column.id === "urgent" && "Tudo em dia! 🎉"}
                          {column.id === "today" && "Dia livre de revisões"}
                          {column.id === "upcoming" && "Sem revisões futuras"}
                          {column.id === "completed" && "Comece a estudar!"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer com insights */}
        <div className="relative p-6 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>Arraste para ver mais colunas</span>
              </div>
              <ChevronRight
                className="w-4 h-4 animate-bounce"
                style={{ animationDirection: "alternate" }}
              />
            </div>

            <div className="flex items-center gap-6 text-slate-400">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                <span>
                  Total de revisões:{" "}
                  <span className="text-white font-bold">
                    {flashcards.filter((c) => c.repetition > 0).length}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes columnSlideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thumb-slate-700::-webkit-scrollbar-thumb {
          background-color: rgb(51, 65, 85);
          border-radius: 3px;
        }
        .scrollbar-track-slate-800\/50::-webkit-scrollbar-track {
          background-color: rgba(30, 41, 59, 0.5);
        }
      `}</style>
    </div>
  );
}

// Exemplo de uso
export default function App() {
  const now = new Date();
  const flashcards = [
    {
      id: "1",
      front: "O que é React e quais são seus principais conceitos?",
      topic: "Frontend Development",
      difficulty: "easy",
      easeFactor: 2.5,
      interval: 7,
      repetition: 3,
      nextReview: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
      performanceAvg: 85.5,
    },
    {
      id: "2",
      front: "Como funciona o useState e useEffect?",
      topic: "React Hooks",
      difficulty: "medium",
      easeFactor: 2.3,
      interval: 3,
      repetition: 2,
      nextReview: now,
      lastReviewedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      performanceAvg: 72.3,
    },
    {
      id: "3",
      front: "O que é closure em JavaScript e como usar?",
      topic: "JavaScript Avançado",
      difficulty: "hard",
      easeFactor: 2.0,
      interval: 14,
      repetition: 4,
      nextReview: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      performanceAvg: 45.8,
    },
    {
      id: "4",
      front: "Como criar um custom hook reutilizável?",
      topic: "React Avançado",
      difficulty: "hard",
      easeFactor: 2.1,
      interval: 5,
      repetition: 2,
      nextReview: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      performanceAvg: 91.2,
    },
    {
      id: "5",
      front: "O que é TypeScript e suas vantagens?",
      topic: "TypeScript",
      difficulty: "easy",
      easeFactor: 2.6,
      interval: 21,
      repetition: 5,
      nextReview: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      performanceAvg: 88.7,
    },
    {
      id: "6",
      front: "Explique o sistema de repetição espaçada",
      topic: "Metodologia de Estudos",
      difficulty: "medium",
      easeFactor: 2.4,
      interval: 10,
      repetition: 3,
      nextReview: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      lastReviewedAt: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
      performanceAvg: 78.9,
    },
    {
      id: "7",
      front: "Como funciona o Virtual DOM?",
      topic: "React Internals",
      difficulty: "hard",
      easeFactor: 2.2,
      interval: 4,
      repetition: 2,
      nextReview: now,
      lastReviewedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      performanceAvg: 65.4,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <ReviewCalendarV2 flashcards={flashcards} />
    </div>
  );
}
