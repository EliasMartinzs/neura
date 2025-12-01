import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ResponseUseGetReviews = InferResponseType<
  typeof client.api.study.reviews.$get
>;

export const useGetReviews = () => {
  const query = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await client.api.study.reviews.$get();

      return await res.json();
    },
    staleTime: Infinity,
  });

  return query;
};
