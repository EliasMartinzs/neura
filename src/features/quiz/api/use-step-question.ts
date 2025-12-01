import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseStepGenerate = InferResponseType<
  (typeof client.api.quiz.steps)[":stepId"]["generate"]["$post"]
>;
type RequestStepGenerate = InferRequestType<
  (typeof client.api.quiz.steps)[":stepId"]["generate"]["$post"]
>["param"];

export const useStepQuestion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseStepGenerate,
    Error,
    RequestStepGenerate
  >({
    mutationKey: ["step-generate"],
    mutationFn: async ({ stepId }) => {
      const res = await client.api.quiz.steps[":stepId"]["generate"].$post({
        param: {
          stepId,
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
