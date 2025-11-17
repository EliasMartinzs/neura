import client from "@/lib/hc";
import { User } from "@prisma/client";
import { useQueries } from "@tanstack/react-query";

async function fetchSession() {
  const res = await client.api.session.$get();

  return res.json();
}

async function fetchDashboard() {
  const res = await client.api.session.dashboard.$get();

  return await res.json();
}

export default function useProfile() {
  const results = useQueries({
    queries: [
      {
        queryKey: ["session"],
        queryFn: fetchSession,
      },
      {
        queryKey: ["dashboard"],
        queryFn: fetchDashboard,
      },
    ],
  });

  const [session, dashboard] = results;

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);
  const isRefetching = results.some((r) => r.isRefetching);

  const refetch = () => Promise.all(results.map((r) => r.refetch()));

  const userData = {
    id: session.data?.data?.user?.id,
    email: session.data?.data?.user?.email,
    name: session.data?.data?.user?.name,
    image: session.data?.data?.user?.image,
    favColor: session.data?.data?.user?.favColor,
    surname: session.data?.data?.user?.surname,
    bio: session.data?.data?.user?.bio,
  } as User;

  return {
    // dados
    user: userData,
    stats: dashboard.data?.data?.stats,
    activities: dashboard.data?.data?.activities,

    // estados combinados
    isLoading,
    isError,
    isRefetching,

    // actions
    refetch,
  };
}
