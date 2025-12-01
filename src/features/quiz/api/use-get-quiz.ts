import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseGetQuiz = InferResponseType<
  (typeof client.api.quiz)[":id"]["$get"]
>;

export const useGetQuiz = (id: string) => {
  const query = useQuery<ResponseGetQuiz, Error>({
    queryKey: ["quiz", id],
    queryFn: async () => {
      const res = await client.api.quiz[":id"].$get({
        param: {
          id,
        },
      });

      return await res.json();
    },
  });

  return query;
};
