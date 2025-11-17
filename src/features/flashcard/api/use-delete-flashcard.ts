import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<
  (typeof client.api.flashcard)[":id"]["$delete"]
>;
type Request = InferRequestType<
  (typeof client.api.flashcard)[":id"]["$delete"]
>["param"];

export const useDeleteFlashcard = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["delete-flashcard"],
    mutationFn: async ({ id }) => {
      const res = await client.api.flashcard[":id"].$delete({
        param: { id },
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      toast.success(message);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards"] }),
        queryClient.invalidateQueries({ queryKey: ["trash-flashcards"] }),
        queryClient.invalidateQueries({ queryKey: ["deck-by-id"] }),
        queryClient.invalidateQueries({ queryKey: ["summary"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
