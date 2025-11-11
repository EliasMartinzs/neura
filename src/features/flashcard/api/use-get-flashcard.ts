import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseFlashcard = InferResponseType<
  (typeof client.api.flashcard)[":id"]["$get"]
>;

export const useGetFlashcard = (id: string) => {
  const query = useQuery<ResponseFlashcard, Error>({
    queryKey: ["flashcard", id],
    queryFn: async () => {
      const res = client.api.flashcard[":id"].$get({
        param: {
          id,
        },
      });

      return (await res).json();
    },
  });

  return query;
};
