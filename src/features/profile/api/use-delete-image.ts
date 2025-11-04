import client from "@/lib/hc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export type ResponseImageDelete = InferResponseType<
  typeof client.api.profile.image.$delete
>;
type Request = InferRequestType<
  typeof client.api.profile.image.$delete
>["form"];

export const useDeleteImage = () => {
  const mutation = useMutation<ResponseImageDelete, Error, Request>({
    mutationKey: ["profile"],
    mutationFn: async ({ publicId }) => {
      const res = await client.api.profile.image.$delete({
        form: {
          publicId,
        },
      });

      return await res.json();
    },
  });

  return mutation;
};
