import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type UseSessionResponse = InferResponseType<
  typeof client.api.session.$get
>;

export const useSession = () => {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const res = await client.api.session.$get();

      if (!res.ok) {
        return {
          code: res.status,
          message: "Não foi possível buscar os dados no banco de dados.",
          data: null,
        };
      }

      return await res.json();
    },
  });
  const { data, isError, isLoading, isRefetching, refetch } = query;

  return {
    user: data?.data?.user,
    isError,
    isLoading,
    isRefetching,
    refetch,
  };
};
