import { openai } from "@/lib/openai";
import { createFlashcardGenerationForm } from "@/schemas/create-flashcard-generattion.schema";
import { z } from "zod";

export const aiGeneratedFlashcardSchema = z.object({
  front: z.string().min(3),
  back: z.string().min(1),
  topic: z.string(),
  subtopic: z.string().optional(),
  difficulty: z.string(),
  bloomLevel: z.string(),
});

export type AIGeneratedFlashcard = z.infer<typeof aiGeneratedFlashcardSchema>;

export async function generateFlashcardsAI(
  input: createFlashcardGenerationForm
) {
  const {
    prompt,
    topic,
    subtopic,
    difficulty,
    bloomLevel,
    amount,
    generationMode,
  } = input;

  const systemPrompt = `
Você é um gerador de flashcards de estudo altamente didático.
Sua tarefa é criar flashcards com base nas informações abaixo.

Detalhes:
- Tema: ${topic}
- Subtema: ${subtopic ?? "nenhum"}
- Dificuldade: ${difficulty}
- Nível Cognitivo (Bloom): ${bloomLevel}
- Modo de geração: ${generationMode}
- Quantidade: ${amount}

Regras:
- Gere EXATAMENTE ${amount} flashcards.
- Responda SOMENTE com JSON válido (sem markdown, sem texto extra).
- Cada item deve seguir este formato:
[
  {
    "front": "Pergunta ou afirmação clara e direta",
    "back": "Resposta breve e correta",
    "topic": "${topic}",
    "subtopic": "${subtopic ?? ""}",
    "difficulty": "${difficulty}",
    "bloomLevel": "${bloomLevel}"
  }
]
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0].message.content;
  if (!text) throw new Error("Falha ao gerar flashcards.");

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    // fallback: extrai conteúdo JSON com regex caso o modelo adicione texto extra
    const match = text.match(/\[.*\]/s);
    if (!match) throw new Error("Resposta inválida da IA.");
    parsed = JSON.parse(match[0]);
  }

  const validated = z.array(aiGeneratedFlashcardSchema).parse(parsed);
  return validated;
}
