import * as z from "zod";

export const createAnswerExplainQuestion = z.object({
  userAnswer: z
    .string()
    .min(2, {
      error: "Respota deve ter pelo menos 2 caracteres.",
    })
    .max(2000, {
      error: "Resposta não pode ter mais de 2000 caracteres.",
    }),
  sessionId: z.string(),
  content: z.string(),
});

export type CreateAnswerExplainQuestion = z.infer<
  typeof createAnswerExplainQuestion
>;
