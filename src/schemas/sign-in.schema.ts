import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({ error: "Digite um email válido" }),
  password: z
    .string()
    .min(8, { error: "A senha deve ter pelo menos 8 caracteres" }),
  rememberMe: z.boolean().default(false).optional(),
});

export type SignInForm = z.infer<typeof signInSchema>;
