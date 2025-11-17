import client from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<(typeof client.api.study)[":id"]["$get"]>;
type Request = InferRequestType<
  (typeof client.api.study)[":id"]["$get"]
>["param"];

export const useGetSession = (id: string) => {
  const query = useQuery<Response, Error, Request>({
    queryKey: ["study-session", id],
    queryFn: async () => {
      const res = await client.api.study[":id"].$get({
        param: {
          id,
        },
      });

      return await res.json();
    },
  });

  return query;
};
