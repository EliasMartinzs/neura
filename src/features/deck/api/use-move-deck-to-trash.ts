import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<(typeof client.api.deck)[":id"]["$put"]>;
type Request = InferRequestType<
  (typeof client.api.deck)[":id"]["$put"]
>["param"];

export const useMoveDeckToTrash = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["deck"],
    mutationFn: async ({ id }) => {
      const res = await client.api.deck[":id"].$put({
        param: {
          id,
        },
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      toast.success(message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["deck"] }),
        queryClient.invalidateQueries({ queryKey: ["trash"] }),
        queryClient.invalidateQueries({ queryKey: ["deck-by-id"] }),
        queryClient.invalidateQueries({ queryKey: ["deck-by-id"] }),
        queryClient.invalidateQueries({ queryKey: ["tags"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
