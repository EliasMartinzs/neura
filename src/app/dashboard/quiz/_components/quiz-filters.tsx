import { Tooltip } from "@/components/shared/tooltip";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuizFilterStore } from "@/features/quiz/hooks/use-quiz-filter-store";
import { cn } from "@/lib/utils";
import { $Enums } from "@prisma/client";
import { ArrowDown01, BookmarkX, Check } from "lucide-react";
import { memo } from "react";

import { CreateQuizButton } from "./create-quiz-button";
import { OpenQuizDocumentation } from "./open-quiz-documentation";

type FilterType = "ALL" | $Enums.QuizStatus;

const quizStatus: Record<FilterType, string> = {
  ALL: "Todos",
  ACTIVE: "Ativos",
  COMPLETED: "Completos",
  ABANDONED: "Abandonados",
};

const QuizFiltersComponent = () => {
  const { filter, setFilter, setPerPage, reset, perPage } =
    useQuizFilterStore();

  return (
    <div className="flex items-center flex-col gap-y-4 lg:justify-between mt-6">
      <div className="flex items-center gap-3">
        {Object.entries(quizStatus).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key as FilterType)}
            className={`px-4 py-2 rounded-xl font-medium transition-all
            ${
              filter === key
                ? "bg-primary text-primary-foreground shadow"
                : "bg-slate-800/50 text-white hover:bg-slate-800 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center max-sm:justify-evenly md:justify-end md:gap-1">
        <OpenQuizDocumentation />

        <CreateQuizButton />

        <Popover>
          <PopoverTrigger>
            <Tooltip
              trigger={
                <div className={buttonVariants({ variant: "ghost" })}>
                  <ArrowDown01 className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
                </div>
              }
              content={<p className="text-sm">Items por pagina</p>}
            />
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="">
              {[5, 10, 20, 50].map((page) => (
                <p
                  key={page}
                  className={cn(
                    "flex items-center gap-x-4 text-muted-foreground",
                    perPage === page && "text-foreground"
                  )}
                  onClick={() => setPerPage(page)}
                >
                  {page}

                  {perPage === page && <Check className="size-4" />}
                </p>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip
          trigger={
            <div
              className={buttonVariants({ variant: "ghost" })}
              onClick={reset}
            >
              <BookmarkX className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200" />
            </div>
          }
          content={<p className="text-sm">Limpar filtros</p>}
        />
      </div>
    </div>
  );
};

export const QuizFilters = memo(QuizFiltersComponent);
QuizFilters.displayName = "QuizFilters";
