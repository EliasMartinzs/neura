import { DeleteFlashcardButton } from "@/app/dashboard/flashcards/_components/delete-flashcard-button";
import { ResponseGetDecks } from "@/features/deck/api/use-get-decks";
import { Activity, BookOpen, Star } from "lucide-react";
import Link from "next/link";

type Flashcard = NonNullable<
  NonNullable<ResponseGetDecks>["data"]
>[number]["flashcards"];

export const DeckSearchedFlashcard = ({
  filteredFlashcards,
  searchTerm,
}: {
  filteredFlashcards: Flashcard;
  searchTerm: string;
}) => {
  return (
    <>
      {filteredFlashcards.length === 0 ? (
        <div className="relative group">
          <div className="absolute -inset-1 text-primary-foreground bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl"></div>
          <div className="relative rounded-3xl p-16 text-center">
            <div className="inline-block p-6 bg-linear-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90  rounded-4xl mb-6">
              <BookOpen className="w-20 h-20 text-purple-400/50" />
            </div>
            <p className="text-xl font-semibold mb-2 text-white">
              {searchTerm
                ? "Nenhum flashcard encontrado"
                : "Nenhum flashcard neste deck ainda"}
            </p>
            <p className="text-white text-sm">
              {searchTerm
                ? "Tente buscar por outro termo"
                : "Crie seu primeiro flashcard para começar a estudar!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredFlashcards.map((flashcard) => {
            const allGrades = flashcard.reviews.map((r: any) => r.grade);
            const averageGrade =
              allGrades.length > 0
                ? allGrades.reduce((sum: number, g: number) => sum + g, 0) /
                  allGrades.length
                : 0;

            const percentage = Math.round(averageGrade ?? 0);

            return (
              <div key={flashcard.id} className="relative group cursor-pointer">
                <div className="relative rounded-2xl p-6 transition-all duration-300 group-hover:scale-105 overflow-hidden h-full flex flex-col gap-y-4 border">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/flashcards/${flashcard.id}`}
                      className="font-bold text-lg mb-4 line-clamp-3 transition-colors leading-tight flex-1 hover:underline"
                    >
                      {flashcard.front || "Flashcard"}
                    </Link>

                    <DeleteFlashcardButton color={""} id={flashcard.id} />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2  text-sm">
                        <Activity className="w-4 h-4" />
                        <span className="font-medium">
                          {flashcard.reviews.length} revisões
                        </span>
                      </div>
                      {averageGrade !== null && averageGrade >= 80 && (
                        <div>
                          <div className="p-1.5 bg-linear-to-br from-yellow-500/30 to-orange-500/30 rounded-lg">
                            <Star className="w-4 h-4 text-yellow-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < percentage ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
