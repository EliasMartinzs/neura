import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ReponseCreateExplainQuestion = InferResponseType<
  (typeof client.api)["explain-learn"]["$post"]
>;
type RequestCreateExplainQuestion = InferRequestType<
  (typeof client.api)["explain-learn"]["$post"]
>["json"];

export const useCreateExplainQuestion = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ReponseCreateExplainQuestion,
    Error,
    RequestCreateExplainQuestion
  >({
    mutationKey: ["explain-question"],
    mutationFn: async (json) => {
      const res = await client.api["explain-learn"].$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["explain-questions"] });
    },
  });

  return mutation;
};
