import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<typeof client.api.deck.tags.$get>;

export const useGetAllTags = () => {
  const query = useQuery<Response, Error>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await client.api.deck.tags.$get();

      return await res.json();
    },
  });
  return query;
};
