import client from "@/lib/hc";
import { OpenStudyStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseGetExplainQuestions = InferResponseType<
  (typeof client.api)["explain-learn"]["$get"]
>;
type Request = InferRequestType<
  (typeof client.api)["explain-learn"]["$get"]
>["query"];

type UseGetExplainQuestions = {
  filter?: "ALL" | OpenStudyStatus;
  page?: number;
  perPage: number;
};

export const useGetExplainQuestions = ({
  perPage,
  filter,
  page,
}: UseGetExplainQuestions) => {
  const query = useQuery<ResponseGetExplainQuestions, Error>({
    queryKey: ["explain-questions", filter, page, perPage],
    queryFn: async () => {
      const res = await client.api["explain-learn"].$get({
        query: {
          ...(filter ? { filter } : {}),
          ...(perPage ? { perPage: String(perPage) } : {}),
          ...(page ? { page: String(page) } : {}),
        } satisfies Request,
      });

      return await res.json();
    },
    staleTime: Infinity,
  });

  return query;
};
