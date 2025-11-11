import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type ResponseDeck = InferResponseType<(typeof client.api.deck)[":id"]["$get"]>;

export const useGetDeck = (id: string) => {
  const query = useQuery<ResponseDeck, Error>({
    queryKey: ["deck-by-id", id],
    queryFn: async () => {
      const res = await client.api.deck[":id"].$get({
        param: {
          id,
        },
      });

      return await res.json();
    },
  });

  const { data, isLoading, isError, refetch, isFetching } = query;

  return {
    deck: data?.data,
    isLoading,
    isError,
    refetch,
    isFetching,
  };
};
