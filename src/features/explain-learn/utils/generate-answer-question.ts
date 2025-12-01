import { openai } from "@/lib/openai";
import * as z from "zod";

const aiGeneratedAnswerQuestion = z.object({
  score: z.number(),
  feedback: z.string(),
  missingPoints: z.string(),
});

type Props = {
  content: string;
  userAnswer: string;
};

export async function generateAnswerQuestion({ content, userAnswer }: Props) {
  const prompt = `
Você é um avaliador especializado. Avalie a resposta de um aluno para uma pergunta aberta.

### Pergunta:
${content}

### Resposta do aluno:
${userAnswer}

### Instruções da avaliação:
1. Dê uma nota de 0 a 100 com base na precisão.
2. Forneça um feedback curto, direto e útil.
3. Liste os pontos que faltaram ou poderiam melhorar (missingPoints), em forma de lista simples separada por ponto e vírgula.
4. Seja sempre objetivo.
5. Nunca invente informações que não estejam na pergunta.

### Formato da resposta (obrigatório):
{
  "score": number,
  "feedback": "string",
  "missingPoints": "string"
}
`.trim();

  const completion = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [
      {
        role: "system",
        content: "Você deve responder apenas com JSON válido.",
      },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices[0].message.content;
  if (!text) {
    return {
      code: 500,
      message: "Falha ao gerar a avaliação!",
      data: null,
    };
  }

  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch {
    // fallback: tenta extrair o JSON de dentro de um texto maior
    const match = text.match(/\{[\s\S]*?\}/);
    if (!match) {
      return {
        code: 500,
        message: "Resposta inválida da IA.",
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

  const validated = aiGeneratedAnswerQuestion.safeParse(parsed);

  if (!validated.success) {
    return {
      code: 500,
      message: "Dados retornados fora do formato esperado.",
      data: null,
    };
  }

  return {
    code: 201,
    message: null,
    data: validated.data,
  };
}
