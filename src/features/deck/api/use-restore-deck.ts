import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<
  (typeof client.api.deck)["restore-deck"]["$put"]
>;
type Request = InferRequestType<
  (typeof client.api.deck)["restore-deck"]["$put"]
>["json"];

export const useRestoreDeck = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["restore-deck"],
    mutationFn: async (json) => {
      const res = await client.api.deck["restore-deck"].$put({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      toast.success(message);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["deck"] }),
        queryClient.invalidateQueries({ queryKey: ["trash"] }),
        queryClient.invalidateQueries({ queryKey: ["tags"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
