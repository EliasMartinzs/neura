import { AppVariables } from "@/app/api/[[...route]]/route";
import arcjet, { slidingWindow } from "@/lib/arcjet";
import { createMiddleware } from "hono/factory";

/**
 * Cria uma instância padrão do Arcjet com regra de sliding window.
 * Limita requisições de leitura a **180 por minuto**.
 */
const buildStandartAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 180,
    })
  );

/**
 * Middleware de segurança para requisições de leitura (read).
 *
 *  Funcionalidades:
 * - Aplica **limite de taxa (rate limiting)** usando Arcjet.
 * - Limita usuários a **180 leituras por minuto**.
 * - Retorna **HTTP 429** quando o usuário ultrapassa o limite de solicitações.
 * - Calcula e retorna mensagem indicando **tempo restante até o reset do limite**.
 *
 * ⚡ Uso:
 * `app.use(readSecutiryMiddleware)` em rotas de leitura sensíveis.
 *
 * @param c - Contexto do Hono, com acesso a `c.req` e `c.get("user")`.
 * @param next - Função para chamar o próximo middleware na stack.
 * @returns `JSON` com mensagem de erro (429) ou chama `next()` se permitido.
 */
export const readSecutiryMiddleware = createMiddleware<{
  Variables: AppVariables;
}>(async (c, next) => {
  const decision = await buildStandartAj().protect(c.req, {
    userId: c.get("user")?.id!,
  });

  let message = "";
  let remaining = 0;

  if (decision.reason.isRateLimit()) {
    const reset = decision.reason.resetTime;
    remaining = decision.reason.remaining;

    if (reset === undefined) {
      message = "";
    } else {
      const seconds = Math.floor((reset.getTime() - Date.now()) / 1000);
      const minutes = Math.ceil(seconds / 60);

      if (minutes > 1) {
        message = `Reseta em ${minutes} minutos.`;
      } else {
        message = `Reseta em ${seconds} segundos.`;
      }
    }
  }

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return c.json(
        {
          message: `Ops! Muitas solicitações seguidas detectadas — aguarde um momento, novas solicitações em ${message}`,
          code: 429,
        },
        429
      );
    }

    c.json({ message: "Solicitações bloquedas, aguarde", code: 429 }, 429);
  }

  await next();
});
