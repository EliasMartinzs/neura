import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseFlashcards = InferResponseType<
  typeof client.api.flashcard.$get
>;

type RequestFlashcards = InferRequestType<
  typeof client.api.flashcard.$get
>["query"];

type Props = {
  deck?: string;
  page?: number;
  perPage?: number;
};

export const useGetFlashcards = ({ deck, page, perPage }: Props) => {
  const query = useQuery<ResponseFlashcards, Error>({
    queryKey: ["flashcards", deck, page, perPage],
    queryFn: async () => {
      const res = await client.api.flashcard.$get({
        query: {
          ...(deck ? { deck } : {}),
          ...(page ? { page: String(page) } : {}),
          ...(perPage ? { perPage: String(perPage) } : {}),
        } satisfies RequestFlashcards,
      });

      return await res.json();
    },
    enabled: true,
  });

  return query;
};
