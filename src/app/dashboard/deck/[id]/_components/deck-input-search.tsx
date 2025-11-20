import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";

export const DeckInputSearch = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (event: string) => void;
}) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 hover:transition-all group px-4 py-2 rounded-xl hover:bg-white/5">
        <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="font-bold text-xl">Flashcards</span>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10"
          />
        </div>
      </div>
    </div>
  );
};
