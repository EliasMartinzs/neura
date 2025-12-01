import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<typeof client.api.flashcard.generate.$post>;
type Request = InferRequestType<
  typeof client.api.flashcard.generate.$post
>["json"];

export const useGenerateFlashcard = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["generate-flashcard"],
    mutationFn: async (json) => {
      const res = await client.api.flashcard.generate.$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards"] }),
        queryClient.invalidateQueries({ queryKey: ["deck"] }),
        queryClient.invalidateQueries({ queryKey: ["deck-by-id"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
    gcTime: 1000 * 60 * 5,
  });

  return mutation;
};
