import z from "zod";

export const reviewFlashcardSchema = z.object({
  flashcardId: z.string(),
  sessionId: z.string().optional(),
  grade: z.number({ error: "Por favor selecione a grade" }).min(0).max(5),
  timeToAnswer: z.number().optional(),
  notes: z.string().optional(),
});

export type ReviewFlashcardForm = z.infer<typeof reviewFlashcardSchema>;
