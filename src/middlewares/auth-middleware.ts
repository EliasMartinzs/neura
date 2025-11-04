import { AppVariables } from "@/app/api/[[...route]]/route";
import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const user = c.get("user");

    if (!user) {
      return c.json(
        {
          code: 401,
          message: "Usuário não autenticado.",
          data: null,
        },
        401
      );
    }

    await next();
  }
);
