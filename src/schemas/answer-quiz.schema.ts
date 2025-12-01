import z from "zod";

export const answerQuizSchema = z.object({
  optionId: z.string().min(1, "optionId é obrigatório"),
});

export type AnswerQuizForm = z.infer<typeof answerQuizSchema>;
