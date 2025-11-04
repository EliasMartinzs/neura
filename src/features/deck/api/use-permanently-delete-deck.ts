import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<(typeof client.api.deck)[":id"]["$delete"]>;
type Request = InferRequestType<
  (typeof client.api.deck)[":id"]["$delete"]
>["param"];

export const usePermanentlyDeleteDeck = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["deck"],
    mutationFn: async ({ id }) => {
      const res = await client.api.deck[":id"].$delete({
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
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
