import { ResponseUseGetReviews } from "@/features/study/api/use-get-reviews";
import { usePageReviews } from "@/features/study/hooks/use-page-reviews";
import { ReviewCard } from "./review-card";

type Flashcard = NonNullable<ResponseUseGetReviews>["data"];

type Props = {
  data: Flashcard;
};

export const ReviewOverview = ({ data }: Props) => {
  const { columns, formatDate, formatTime, getDaysUntil } = usePageReviews({
    data,
  });

  return (
    <div className="relative">
      <div className="relative p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-4">
          {columns.map((column) => {
            const Icon = column.icon;

            return (
              <div key={column.id}>
                {/* Header da coluna */}
                <div className="sticky top-0 z-10 mb-4">
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${column.bgGradient} border border-slate-700/50 backdrop-blur-xl p-4`}
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
                          <h3 className="font-bold text-lg">{column.title}</h3>
                          <p className="text-muted-foreground text-xs">
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
                        className={`h-full bg-linear-to-r ${column.gradient} transition-all duration-1000`}
                      />
                    </div>
                  </div>
                </div>

                {/* Cards da coluna */}
                <div className="space-y-3 max-h-3/4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                  {Number(column?.cards?.length) > 0 ? (
                    column?.cards?.map((card, index) => (
                      <ReviewCard
                        card={card}
                        index={index}
                        column={column}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        getDaysUntil={getDaysUntil}
                        key={index}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div
                        className={`mx-auto w-16 h-16 rounded-2xl bg-linear-to-br ${column.bgGradient} flex items-center justify-center mb-3 opacity-80`}
                      >
                        <Icon className={`w-8 h-8 ${column.iconColor}`} />
                      </div>
                      <p className="text-sm font-medium">Nenhum card aqui</p>
                      <p className="text-xs mt-1">
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
    </div>
  );
};
