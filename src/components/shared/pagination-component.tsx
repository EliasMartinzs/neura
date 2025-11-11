import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
};

export const PaginationComponent = ({ page, totalPages, setPage }: Props) => {
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const getPageNumbers = () => {
    const visiblePages: (number | "ellipsis")[] = [];

    // Sempre mostra a primeira página
    if (page > 3) {
      visiblePages.push(1);
      if (page > 4) visiblePages.push("ellipsis");
    }

    // Páginas em volta da atual
    for (
      let i = Math.max(1, page - 2);
      i <= Math.min(totalPages, page + 2);
      i++
    ) {
      visiblePages.push(i);
    }

    // Sempre mostra a última página
    if (page < totalPages - 2) {
      if (page < totalPages - 3) visiblePages.push("ellipsis");
      visiblePages.push(totalPages);
    }

    return visiblePages;
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Botão Anterior */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePrev();
            }}
            aria-disabled={page === 1}
            className={page === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {/* Páginas dinâmicas */}
        {getPageNumbers().map((item, i) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                href="#"
                isActive={page === item}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(item);
                }}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {/* Botão Próximo */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
