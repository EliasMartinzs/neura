import { DeckDifficulty } from "@/generated/prisma/enums";
import z from "zod";

const difficultyEnum = z.enum(DeckDifficulty);

export const editDeckSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(2, {
      error: "Por favor, insira o nome de seu deck",
    })
    .max(20, {
      error: "Limite maximo de 20 caracteres",
    })
    .optional(),
  description: z
    .string()
    .max(256, {
      error: "Limite maximo de 256 caracteres",
    })
    .optional(),
  color: z.string().optional(),
  difficulty: difficultyEnum.default("EASY").optional(),
  tags: z.array(z.string()).optional(),
});

export type EditDeckForm = z.infer<typeof editDeckSchema>;
