import client from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

export type ResponseEditProfile = InferResponseType<
  typeof client.api.profile.$put
>;
export type RequestEditProfile = InferRequestType<
  typeof client.api.profile.$put
>["form"];

export const useEditProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseEditProfile, Error, RequestEditProfile>({
    mutationKey: ["profile"],
    mutationFn: async (values) => {
      const res = await client.api.profile.$put({
        form: values,
      });

      return await res.json();
    },
    onSuccess: ({ message }) => {
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return mutation;
};
