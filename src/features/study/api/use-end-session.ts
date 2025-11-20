import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<typeof client.api.study.end.$post>;
type Request = InferRequestType<typeof client.api.study.end.$post>["json"];

export const useEndSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["end"],
    mutationFn: async (json) => {
      const res = await client.api.study.end.$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });
      queryClient.invalidateQueries({ queryKey: ["deck-by-id"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
