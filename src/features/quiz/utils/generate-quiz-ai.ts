import { openai } from "@/lib/openai";
import { AIQuizResponse, aiQuizResponseSchema } from "@/schemas/ai-quiz.schema";

type GenerateAIPayload = {
  topic: string;
  subtopic?: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  style: "DIRECT" | "REAL_SCENARIO" | "TRICKY" | "EXAM_LEVEL";
  explanationType?: "SHORT" | "DETAILED" | "ANALOGY" | "PRACTICAL";
  stepType: "CONCEPT" | "EXAMPLE" | "COMPARISON" | "APPLICATION";
};

export async function generateQuizAI(
  payload: GenerateAIPayload,
  retry = 0
): Promise<AIQuizResponse> {
  const { topic, subtopic, difficulty, style, explanationType, stepType } =
    payload;

  // prompt inteligente baseado no step
  const stepInstruction = {
    CONCEPT:
      "Crie uma pergunta que teste o entendimento conceitual do tema. Foque em definição, ideia central ou princípio fundamental.",
    EXAMPLE:
      "Crie uma pergunta baseada em exemplo prático. O usuário deve identificar o uso correto ou incorreto do conceito.",
    COMPARISON:
      "Crie uma pergunta comparando duas afirmações similares. A intenção é testar a habilidade de diferenciar conceitos.",
    APPLICATION:
      "Crie uma pergunta de aplicação prática, onde o usuário deve resolver um pequeno problema usando o conceito.",
  }[stepType];

  const styleInstruction = {
    DIRECT: "Use um estilo direto e claro, sem floreios.",
    REAL_SCENARIO:
      "Use um cenário realista ou cotidiano para contextualizar a pergunta.",
    TRICKY: "Crie alternativas que induzam ao erro, mas sem serem injustas.",
    EXAM_LEVEL:
      "Use tom de prova, com enunciado mais formal e alternativas mais sofisticadas.",
  }[style];

  const difficultyInstruction = {
    EASY: "Crie uma pergunta bem simples e introdutória.",
    MEDIUM: "Crie uma pergunta com dificuldade intermediária.",
    HARD: "Crie uma pergunta difícil e desafiadora, exigindo análise.",
  }[difficulty];

  const explanationInstruction = explanationType
    ? `Após as opções, gere também uma explicação no estilo: ${explanationType}.`
    : "Não gere explicação.";

  const prompt = `
Você é um gerador de questões de quiz educacionais de alta qualidade.
Gere APENAS JSON válido seguindo exatamente o formato abaixo.

Tema: ${topic}
Subtema: ${subtopic ?? "Nenhum"}
Nível de dificuldade: ${difficulty}
Estilo: ${style}
Tipo de etapa: ${stepType}

Regras para gerar a pergunta:
- ${stepInstruction}
- ${styleInstruction}
- ${difficultyInstruction}
- Gere exatamente 5 opções.
- SOMENTE 1 deve ter "isCorrect: true".
- As outras 4 devem ter "isCorrect: false".
- Cada opção deve ser clara, distinta e plausível.
- ${explanationInstruction} 
- Retorne APENAS JSON válido, sem texto fora do JSON.

Formato EXATO da resposta:
{
  "content": "texto da pergunta",
  "options": [
    { "text": "...", "isCorrect": true ou false },
    { "text": "...", "isCorrect": true ou false },
    { "text": "...", "isCorrect": true ou false },
    { "text": "...", "isCorrect": true ou false },
    { "text": "...", "isCorrect": true ou false }
  ],
  ${
    explanationType
      ? `"explanation": { "text": "...", "type": "${explanationType}" }`
      : ""
  }
}
`;

  try {
    const completion = await openai.responses.create({
      model: "gpt-4.1",
      input: prompt,
      temperature: 0.5,
    });

    const rawText = completion.output_text.trim();

    const parsed = aiQuizResponseSchema.parse(JSON.parse(rawText));

    return parsed;
  } catch (err) {
    if (retry < 2) {
      console.warn("IA JSON inválido. Tentando novamente...");
      return generateQuizAI(payload, retry + 1);
    }

    console.error("Falha ao gerar pergunta da IA:", err);
    throw new Error("A IA retornou dados inválidos.");
  }
}
