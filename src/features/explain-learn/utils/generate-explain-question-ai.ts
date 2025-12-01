import { openai } from "@/lib/openai";
import { CreateExplainQuestionForm } from "@/schemas/create-explain-question.schema";
import z from "zod";

const difficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

const aiGeneratedExplainQuestion = z.object({
  content: z.string(),
  idealAnswer: z.string(),
  difficulty: difficultyEnum,
});

export async function generateExplainQuestionAi(
  input: CreateExplainQuestionForm
) {
  const systemPrompt = `
Você deve responder sempre e somente com um JSON válido.
Nunca coloque texto fora do JSON.
  `.trim();

  const userPrompt = `
Gere exatamente 1 pergunta no formato JSON abaixo:

{
  "content": "string",
  "idealAnswer": "string",
  "difficulty": "${input.difficulty}"
}

REGRAS:
1. "content" = uma pergunta clara, simples e direta.
2. "idealAnswer" = resposta objetiva e verdadeira.
3. NUNCA gere mais de uma pergunta.
4. Tudo deve ser respondível sem contexto externo.
5. Adapte ao nível de dificuldade.
6. Sempre retorne JSON válido e nada além disso.

Dados do usuário:
- Tema: "${input.topic}"
- Dificuldade: "${input.difficulty}"
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const text = completion.choices[0].message.content;
  if (!text) {
    return {
      code: 500,
      message: "Falha ao gerar a questão!",
      data: null,
    };
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    // fallback: tenta extrair JSON completo
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return {
        code: 500,
        message: "Formato inválido retornado pela IA.",
        data: null,
      };
    }

    try {
      parsed = JSON.parse(match[0]);
    } catch {
      return {
        code: 500,
        message: "JSON inválido retornado pela IA.",
        data: null,
      };
    }
  }

  const validated = aiGeneratedExplainQuestion.safeParse(parsed);

  if (!validated.success) {
    return {
      code: 500,
      message: "A IA retornou dados fora do formato esperado.",
      data: null,
    };
  }

  return {
    code: 201,
    message: null,
    data: validated.data,
  };
}
