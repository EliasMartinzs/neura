import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<typeof client.api.flashcard.$post>;
type Resquest = InferRequestType<typeof client.api.flashcard.$post>["json"];

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Resquest>({
    mutationKey: ["flashcard"],
    mutationFn: async (json) => {
      const res = await client.api.flashcard.$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
