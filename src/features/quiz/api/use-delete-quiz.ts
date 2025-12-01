import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type Response = InferResponseType<(typeof client.api.quiz)[":id"]["$delete"]>;
type Request = InferRequestType<
  (typeof client.api.quiz)[":id"]["$delete"]
>["param"];

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["delete-quiz"],
    mutationFn: async ({ id }) => {
      const res = await client.api.quiz[":id"].$delete({
        param: {
          id,
        },
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
