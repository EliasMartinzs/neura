import { Separator } from "@/components/shared/separator";
import { timeAgo } from "@/lib/utils";

interface Mock {
  id: string;
  userId: string;
  flashcardsCreated: number;
  decksCount: number;
  studiesCompleted: number;
  accuracyRate: number;
  lastStudyAt: Date;
  studyStreak: number;
  mostStudiedCategories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const DetailsStatistics = ({ mock }: { mock: Mock }) => {
  return (
    <div className="rounded-3xl border p-6 shadow space-y-4 bg-card">
      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">Meus decks</p>
        <p>{mock?.decksCount ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">Meus flashcards</p>
        <p>{mock?.flashcardsCreated ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">Estudos concluídos</p>
        <p>{mock?.studiesCompleted ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">Acertos médios</p>
        <p>{mock?.accuracyRate ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">Último estudo</p>
        <p>{timeAgo(mock?.lastStudyAt) ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize">
        <p className="text-muted-foreground">
          Sequência dias consecutivos estudando
        </p>
        <p>{mock?.studyStreak ?? "0"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6">
        <p className="text-muted-foreground">Top 5 temas</p>

        <div className="flex items-center gap-x-2">
          {mock.mostStudiedCategories.length > 0 &&
            mock.mostStudiedCategories
              .filter((_, i) => i - 5)
              .map((item) => <p key={item}>{item}</p>)}
        </div>
        <Separator />
      </div>
    </div>
  );
};
