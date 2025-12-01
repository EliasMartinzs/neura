import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<typeof client.api.deck.names.$get>;

type Props = {
  hasFlashcard?: boolean;
};

export const useGetDeckNames = ({ hasFlashcard }: Props) => {
  const query = useQuery<Response, Error>({
    queryKey: ["deck", "names", hasFlashcard],
    queryFn: async () => {
      const res = await client.api.deck.names.$get({
        query: {
          hasFlashcard:
            hasFlashcard === undefined
              ? undefined
              : hasFlashcard
              ? "true"
              : "false",
        },
      });

      return await res.json();
    },
    staleTime: Infinity,
  });

  return query;
};
