import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseStepGenerate = InferResponseType<
  (typeof client.api.quiz.steps)[":stepId"]["answer"]["$post"]
>;
type RequestStepGenerate = InferRequestType<
  (typeof client.api.quiz.steps)[":stepId"]["answer"]["$post"]
>["json"];

export const useStepAnswer = (stepId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseStepGenerate,
    Error,
    RequestStepGenerate
  >({
    mutationKey: ["step-generate", stepId],
    mutationFn: async ({ optionId }) => {
      const res = await client.api.quiz.steps[":stepId"]["answer"].$post({
        param: {
          stepId,
        },
        json: {
          optionId,
        },
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
