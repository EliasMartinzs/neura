import { $Enums } from "@prisma/client";
import z from "zod";

const difficultyEnum = z.enum($Enums.QuizDifficulty);
const styleEnum = z.enum($Enums.QuizStyle);
const explanationTypeEnum = z.enum($Enums.ExplanationType);

export const createQuizSchema = z.object({
  topic: z
    .string()
    .min(2, {
      error: "Minimo 2 caracteres",
    })
    .max(300, {
      error: "Maximo 300 caracteres",
    }),
  subtopic: z.string().optional(),
  difficulty: difficultyEnum,
  style: styleEnum,
  explanationType: explanationTypeEnum,
  mode: z.string(),
});

export type CreateQuizForm = z.infer<typeof createQuizSchema>;
