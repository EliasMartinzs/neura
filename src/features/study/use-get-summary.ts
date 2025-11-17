import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<
  (typeof client.api.study.summary)[":id"]["$get"]
>;
type Request = InferRequestType<
  (typeof client.api.study.summary)[":id"]["$get"]
>["param"];

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

  const { data, isLoading, isRefetching, isError, refetch } = query;

  return {
    data: data?.data,
    isLoading,
    isRefetching,
    isError,
    refetch,
  };
};
