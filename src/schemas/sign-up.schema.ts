import * as z from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(3, { error: "O nome de usuário deve ter pelo menos 3 caracteres" })
    .max(20, { error: "O nome de usuário deve ter no máximo 20 caracteres" }),
  email: z.string().email({ error: "Digite um email válido" }),
  password: z
    .string()
    .min(8, { error: "A senha deve ter pelo menos 8 caracteres" }),
});

export type SignUpForm = z.infer<typeof signUpSchema>;
