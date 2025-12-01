import { DeckDifficulty } from "@prisma/client";
import * as z from "zod";

const difficultyEnum = z.enum(DeckDifficulty);

export const createExplainQuestion = z.object({
  topic: z
    .string()
    .min(2, {
      message: "O tópico deve ter pelo menos 2 caracteres.",
    })
    .max(2000, {
      message: "O tópico não pode ter mais de 2000 caracteres.",
    }),
  difficulty: difficultyEnum,
});

export type CreateExplainQuestionForm = z.infer<typeof createExplainQuestion>;
