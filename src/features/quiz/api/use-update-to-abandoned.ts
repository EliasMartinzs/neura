import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type Response = InferResponseType<typeof client.api.quiz.abandon.$post>;
type Request = InferRequestType<typeof client.api.quiz.abandon.$post>["json"];

export const useUpdateToAbandoned = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["abandoned-quiz"],
    mutationFn: async ({ sessionId }) => {
      const res = await client.api.quiz.abandon.$post({
        json: { sessionId },
      });

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
  });

  return mutation;
};
