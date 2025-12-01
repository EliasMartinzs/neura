import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseCreateQuiz = InferResponseType<typeof client.api.quiz.$post>;
type RequestCreateQuiz = InferRequestType<typeof client.api.quiz.$post>["json"];

export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutate = useMutation<ResponseCreateQuiz, Error, RequestCreateQuiz>({
    mutationKey: ["create-quiz"],
    mutationFn: async (json) => {
      const res = await client.api.quiz.$post({
        json,
      });

      return await res.json();
    },
    onSuccess: ({ data }) => {
      if (data?.session.id) {
        router.push(`/dashboard/quiz/${data?.session.id}`);
      }

      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutate;
};
