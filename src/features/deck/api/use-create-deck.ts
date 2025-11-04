import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseDeck = InferResponseType<typeof client.api.deck.$post>;
type RequestDeck = InferRequestType<typeof client.api.deck.$post>["json"];

export const useCreateDeck = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseDeck, Error, RequestDeck>({
    mutationKey: ["deck"],
    mutationFn: async (deck) => {
      const res = await client.api.deck.$post({
        json: deck,
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["deck"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
