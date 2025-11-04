import { DeckDifficulty } from "@prisma/client";
import z from "zod";

const difficultyEnum = z.enum(DeckDifficulty);

export const createDeckSchema = z.object({
  name: z
    .string()
    .min(2, {
      error: "Por favor, insira o nome de seu deck",
    })
    .max(20, {
      error: "Limite maximo de 20 caracteres",
    }),
  description: z
    .string()
    .max(256, {
      error: "Limite maximo de 256 caracteres",
    })
    .optional(),
  color: z.string().min(1, {
    error: "Por favor selecione a cor do deck",
  }),
  difficulty: difficultyEnum.default("EASY").optional(),
  tags: z.array(z.string()).default([]).optional(),
});

export type CreateDeckForm = z.infer<typeof createDeckSchema>;
