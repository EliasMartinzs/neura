import * as z from "zod";

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { error: "A senha deve ter pelo menos 8 caracteres" }),
});

export type ResetPassowordForm = z.infer<typeof resetPasswordSchema>;
