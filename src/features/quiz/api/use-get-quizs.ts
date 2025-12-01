import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseGetQuiz = InferResponseType<
  (typeof client.api.quiz)["$get"]
>;
type Response = InferRequestType<(typeof client.api.quiz)["$get"]>["query"];

type FilterType = "ALL" | "ACTIVE" | "COMPLETED" | "ABANDONED";

type Props = {
  filter: FilterType;
  page: number;
  perPage: number;
};

export const useGetQuizs = ({ filter, page, perPage }: Props) => {
  const query = useQuery<ResponseGetQuiz, Error>({
    queryKey: ["quiz", filter, page, perPage],
    queryFn: async () => {
      const res = await client.api.quiz.$get({
        query: {
          status: filter,
          ...(perPage ? { perPage: String(perPage) } : {}),
          ...(page ? { page: String(page) } : {}),
        } satisfies Response,
      });

      return await res.json();
    },
  });

  return query;
};
