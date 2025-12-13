import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseGetDecks = InferResponseType<typeof client.api.deck.$get>;
type Request = InferRequestType<typeof client.api.deck.$get>["query"];

interface UseGetDecksProps {
  tags?: string[];
  page?: number;
  perPage?: number;
  search?: string;
}

export const useGetDecks = ({
  tags,
  page,
  perPage,
  search,
}: UseGetDecksProps = {}) => {
  const query = useQuery<ResponseGetDecks, Error>({
    queryKey: ["deck", tags, page, perPage, search],
    queryFn: async () => {
      const res = await client.api.deck.$get({
        query: {
          ...(tags ? { tags } : {}),
          ...(page ? { page: String(page) } : {}),
          ...(perPage ? { perPage: String(perPage) } : {}),
          ...(search ? { search } : {}),
        } satisfies Request,
      });

      if (!res.ok) {
        throw new Error("Falha ao buscar decks");
      }

      return res.json();
    },
    staleTime: Infinity,
  });

  return query;
};
