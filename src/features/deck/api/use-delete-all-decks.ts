import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<(typeof client.api.deck)["$delete"]>;
type Request = InferRequestType<(typeof client.api.deck)["$delete"]>["json"];

export const useDeleteAllDecks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["deck"],
    mutationFn: async (json) => {
      const res = await client.api.deck.$delete({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      toast.success(message);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["trash"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
