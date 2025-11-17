import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export type ResponseResetStudy = InferResponseType<
  (typeof client.api.study)[":id"]["$delete"]
>;

export const useResetStudy = (id: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseResetStudy, Error>({
    mutationKey: ["reset", id],
    mutationFn: async () => {
      const res = await client.api.study[":id"].$delete({
        param: {
          id,
        },
      });

      return await res.json();
    },
    onSuccess: ({ message, data }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["deck-by-id"] });
      if (data) {
        router.push(`/dashboard/deck/${data?.deckId}`);
      }
    },
  });

  return mutation;
};
