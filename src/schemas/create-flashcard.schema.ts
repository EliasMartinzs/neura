import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import * as z from "zod";

const FlashcardDifficultyEnum = z.nativeEnum(FlashcardDifficulty);
const BloomLevelEnum = z.nativeEnum(BloomLevel);

export const createFlashcardSchema = z.object({
  // 1º passo
  deckId: z.string().min(1, {
    message:
      "Escolha o deck que vai armazenar este flashcard. Assim ele ficará organizado junto aos temas correspondentes.",
  }),

  // 2º passo
  front: z.string().min(1, { message: "Deve conter uma pergunta" }),
  back: z.string().min(1, { message: "Deve conter uma resposta" }),

  // 3º passo
  topic: z.string().optional(),
  subtopic: z.string().optional(),
  difficulty: FlashcardDifficultyEnum,
  bloomLevel: BloomLevelEnum,
  note: z.string().optional(),
  color: z.string().min(1, {
    message: "Selecione a cor do flashcard",
  }),
});

export type CreateFlashcardForm = z.infer<typeof createFlashcardSchema>;
