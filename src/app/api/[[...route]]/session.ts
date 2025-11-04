import { Hono } from "hono";
import { AppVariables } from "./route";
import prisma from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth-middleware";

const app = new Hono<{
  Variables: AppVariables;
}>().get("/", authMiddleware, async (c) => {
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
});

export default app;
