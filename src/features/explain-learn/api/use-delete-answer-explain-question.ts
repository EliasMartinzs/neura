import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
type Response = InferResponseType<
  (typeof client.api)["explain-learn"]["$delete"]
>;
type Request = InferRequestType<
  (typeof client.api)["explain-learn"]["$delete"]
>["json"];

export const useDeleteExplainQuestion = () => {
  const query = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["delete-explain-question"],
    mutationFn: async ({ id }) => {
      const res = await client.api["explain-learn"].$delete({
        json: { id },
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);

      query.invalidateQueries({ queryKey: ["explain-questions"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutation;
};
