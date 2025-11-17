import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import * as z from "zod";

const difficultyEnum = z.enum(FlashcardDifficulty, {
  error: "Selecione a dificuldade.",
});
const bloomLevelEnum = z.enum(BloomLevel, {
  error: "Selecione o nível cognitivo (Bloom).",
});
const generationModeEnum = z.enum(["SIMPLE", "DETAILED", "QUIZ", "EXPLAINED"]);

export const createFlashcardGenerationSchema = z.object({
  prompt: z
    .string()
    .min(5, {
      error: "Descreva melhor o conteúdo para gerar bons flashcards.",
    })
    .max(300, {
      error: "O prompt não pode ser muito longo.",
    }),
  topic: z
    .string()
    .min(1, {
      error: "Informe um tema principal.",
    })
    .max(100, {
      error: "O tema é muito longo.",
    }),
  subtopic: z
    .string()
    .max(100, {
      error: "O subtópico é muito longo.",
    })
    .optional(),
  difficulty: difficultyEnum,
  bloomLevel: bloomLevelEnum,
  amount: z
    .number({
      error: "Informe quantos flashcards deseja gerar.",
    })
    .min(1, {
      error: "Pelo menos 1 flashcard deve ser gerado.",
    })
    .max(10, {
      error: "Você pode gerar no máximo 10 flashcards por vez.",
    }),
  generationMode: generationModeEnum,
  deckId: z.string().min(1),
});

export type createFlashcardGenerationForm = z.infer<
  typeof createFlashcardGenerationSchema
>;
