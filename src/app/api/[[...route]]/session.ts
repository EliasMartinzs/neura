import prisma from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { Hono } from "hono";
import { AppVariables } from "./route";

const app = new Hono<{
  Variables: AppVariables;
}>().get("/", authMiddleware, async (c) => {
  try {
    const getUser = c.get("user");

    const user = await prisma.user.findUnique({
      where: {
        id: getUser?.id!,
      },
      include: {
        decks: true,
        flashcards: true,
        aIGeneratedCard: true,
      },
    });

    return c.json(
      {
        data: {
          user,
        },
        code: 200,
        message: null,
      },
      200
    );
  } catch (error) {
    return handlePrismaError(c, error);
  }
});

export default app;
