import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Response = InferResponseType<typeof client.api.study.start.$post>;
type Request = InferRequestType<typeof client.api.study.start.$post>["json"];

export const useStartStudy = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationKey: ["study"],
    mutationFn: async (json) => {
      const res = await client.api.study.start.$post({
        json: json,
      });

      return await res.json();
    },
    onSuccess: async ({ message, data }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["flashcards"] });

      if (data) {
        router.push(`/dashboard/session/${data.sessionId}/${data.deckId}`);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
