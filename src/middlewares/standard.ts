import { AppVariables } from "@/app/api/[[...route]]/route";
import arcjet, { detectBot, shield } from "@/lib/arcjet";
import { createMiddleware } from "hono/factory";

/**
 * Cria uma instância padrão do Arcjet com regras de segurança:
 * - Shield: aplica WAF (Web Application Firewall) em modo LIVE.
 * - DetectBot: identifica bots, permitindo apenas categorias confiáveis.
 */
const buildStandartAj = () =>
  arcjet
    .withRule(
      shield({
        mode: "LIVE",
      })
    )
    .withRule(
      detectBot({
        mode: "LIVE",
        allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:PREVIEW",
          "CATEGORY:MONITOR",
        ],
      })
    );

/**
 * Middleware de segurança padrão para todas as requisições.
 *
 * Funcionalidades:
 * - Bloqueia **bots não autorizados** e tráfego automatizado.
 * - Aplica **políticas de segurança (WAF)** usando Shield.
 * - Retorna **HTTP 403** quando a requisição é negada.
 *
 * ⚡ Uso:
 * `app.use(standardSecurityMiddleware)` para proteger rotas gerais.
 *
 * @param c - Contexto do Hono, com acesso a `c.req` e `c.get("user")`.
 * @param next - Função para chamar o próximo middleware na stack.
 * @returns `JSON` com mensagem de erro (403) ou chama `next()` se permitido.
 */
export const standardSecurityMiddleware = createMiddleware<{
  Variables: AppVariables;
}>(async (c, next) => {
  const decision = await buildStandartAj().protect(c.req, {
    userId: c.get("user")?.id!,
  });

  if (decision.isDenied()) {
    if (decision.reason.isBot()) {
      return c.json({ message: "Tráfego automatizado bloqueado" }, 403);
    }

    if (decision.reason.isShield()) {
      return c.json(
        {
          message: "Bloqueio de solicitações por política de segurança (WAF).",
          code: 429,
        },
        403
      );
    }

    return c.json(
      {
        message: "Requisição bloqueada!",
        code: 429,
      },
      403
    );
  }

  await next();
});
