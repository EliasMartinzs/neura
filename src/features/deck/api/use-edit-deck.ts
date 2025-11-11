import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<(typeof client.api.deck)["$put"]>;
type Request = InferRequestType<(typeof client.api.deck)["$put"]>["json"];

export const useEditDeck = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["deck"],
    mutationFn: async (json) => {
      const res = await client.api.deck.$put({
        json: json,
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["deck"] });
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.invalidateQueries({ queryKey: ["deck-by-id"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
