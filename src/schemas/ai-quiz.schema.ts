import z from "zod";

export const aiOptionSchema = z.object({
  text: z.string(),
  isCorrect: z.boolean(),
});

export const aiExplanationSchema = z.object({
  text: z.string(),
  type: z.enum(["SHORT", "DETAILED", "ANALOGY", "PRACTICAL"]),
});

export const aiQuizResponseSchema = z.object({
  content: z.string(),
  options: z.array(aiOptionSchema).length(5),
  explanation: aiExplanationSchema.optional(),
});

export type AIQuizResponse = z.infer<typeof aiQuizResponseSchema>;
