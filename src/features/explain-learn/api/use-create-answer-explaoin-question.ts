import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseCreateAnswer = InferResponseType<
  (typeof client.api)["explain-learn"]["review"]["$post"]
>;
type RequestCreateAnswer = InferRequestType<
  (typeof client.api)["explain-learn"]["review"]["$post"]
>["json"];

export const useCreateAnswerExplainQuestion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseCreateAnswer,
    Error,
    RequestCreateAnswer
  >({
    mutationKey: ["explain-answer"],
    mutationFn: async (json) => {
      const res = await client.api["explain-learn"]["review"].$post({
        json,
      });

      return await res.json();
    },
    onSuccess: async ({ message }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["explain-learn"] }),
        queryClient.invalidateQueries({ queryKey: ["explain-questions"] }),
      ]);
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
