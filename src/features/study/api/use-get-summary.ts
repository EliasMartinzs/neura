import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

type Response = InferResponseType<
  (typeof client.api.study.summary)[":id"]["$get"]
>;

export const useGetSummary = (id: string) => {
  const query = useQuery<Response, Error>({
    queryKey: ["summary", id],
    queryFn: async () => {
      const res = await client.api.study.summary[":id"].$get({
        param: {
          id,
        },
      });

      return await res.json();
    },
  });

  return query;
};
