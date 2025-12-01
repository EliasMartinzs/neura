import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseResetQuiz = InferResponseType<typeof client.api.quiz.reset.$post>;
type RequestResetQuiz = InferRequestType<
  typeof client.api.quiz.reset.$post
>["json"];

export const useResetQuiz = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutate = useMutation<ResponseResetQuiz, Error, RequestResetQuiz>({
    mutationKey: ["reset-quiz"],
    mutationFn: async (json) => {
      const res = await client.api.quiz.reset.$post({
        json,
      });

      return await res.json();
    },
    onSuccess: ({ data }) => {
      if (data) {
        router.push(`/dashboard/quiz/${data.id}`);
      }
      queryClient.invalidateQueries({ queryKey: ["quiz"] });
    },
    onError: ({ message }) => {
      toast.error(message);
    },
  });

  return mutate;
};
