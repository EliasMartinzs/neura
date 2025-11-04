import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<typeof client.api.deck.trash.$get>;

export const useGetTrash = () => {
  const query = useQuery<Response, Error>({
    queryKey: ["trash"],
    queryFn: async () => {
      const res = await client.api.deck.trash.$get();

      return await res.json();
    },
  });

  return query;
};
