import { AppVariables } from "@/app/api/[[...route]]/route";
import arcjet, { slidingWindow } from "@/lib/arcjet";
import { createMiddleware } from "hono/factory";

/**
 * Cria uma instância padrão do Arcjet com regra de sliding window.
 * Limita ações do usuário a 2 requisições por 1 minuto.
 */
const buildStandartAj = () =>
  arcjet.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: "1m",
      max: 4,
    })
  );

/**
 * Middleware de segurança para requisições críticas (heavy write).
 *
 *  Funcionalidades:
 * - Aplica **limite de taxa (rate limiting)** usando Arcjet.
 * - Limita usuários a **2 ações por minuto**.
 * - Retorna **HTTP 429** quando o usuário ultrapassa o limite de ações.
 * - Retorna **HTTP 403** quando negado por outros motivos.
 * - Calcula e retorna mensagem com **tempo restante até reset do limite**.
 *
 * ⚡ Uso:
 * `app.use(heavyWriteSecurityMiddleware)` em rotas sensíveis.
 *
 * @param c - Contexto do Hono, com acesso a `c.req` e `c.get("user")`.
 * @param next - Função para chamar o próximo middleware na stack.
 * @returns `JSON` com mensagem de erro ou chama `next()` se permitido.
 */
export const heavyWriteSecurityMiddleware = createMiddleware<{
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
          message: `Limite de ações atingido — aguarde um momento antes de continuar. ${message}`,
          code: 429,
        },
        429
      );
    } else {
      return c.json({ message: "Aguader um momento", code: 403 }, 403);
    }
  }

  await next();
});
