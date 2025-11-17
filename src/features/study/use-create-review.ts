import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<typeof client.api.study.review.$post>;
type Request = InferRequestType<typeof client.api.study.review.$post>["json"];

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["review"],
    mutationFn: async (json) => {
      const res = await client.api.study.review.$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["flashcards"] }),
        queryClient.invalidateQueries({ queryKey: ["summary"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
