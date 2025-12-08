import client from '@/lib/hc';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type DashboardResponse = InferResponseType<
  typeof client.api.session.dashboard.$get
>;

export const useDashboard = () => {
  const query = useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await client.api.session.dashboard.$get();

      return await res.json();
    },
    staleTime: Infinity,
  });

  return query;
};
