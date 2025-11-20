import * as z from "zod";

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(4, {
      error: "Nome deve ter no minimo 4 caracteres",
    })
    .optional(),
  surname: z.string().optional(),
  bio: z.string().optional(),
  favColor: z.string().optional(),
  image: z.string().optional(),
});

export type EditProfileForm = z.infer<typeof editProfileSchema>;
