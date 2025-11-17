import prisma from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { Hono } from "hono";
import { AppVariables } from "./route";

type Flashcard = {
  id: string;
  front: string;
  topic?: string;
  difficulty?: string;
  easeFactor: number;
  interval: number;
  repetition: number;
  nextReview?: Date;
  performanceAvg?: number;
};

const app = new Hono<{
  Variables: AppVariables;
}>()
  .get("/", authMiddleware, async (c) => {
    try {
      const getUser = c.get("user");

      const user = await prisma.user.findUnique({
        where: {
          id: getUser?.id!,
        },
        include: {
          decks: {
            where: {
              deletedAt: null,
            },
          },
          flashcards: true,
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
  })
  .get("/dashboard", authMiddleware, async (c) => {
    try {
      const user = c.get("user");

      const now = new Date();
      const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
      );
      const end = new Date(
        Date.UTC(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          23,
          59,
          59,
          999
        )
      );

      const result = await prisma.$transaction(async (tx) => {
        const stats = await prisma.userStats.findUnique({
          where: {
            userId: user?.id!,
          },
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        });

        const cardsReviewToday = await tx.flashcard.findMany({
          where: {
            userId: user?.id,
            nextReview: {
              gte: start,
              lte: end,
            },
          },
          select: {
            id: true,
            front: true,
            topic: true,
            difficulty: true,
            easeFactor: true,
            interval: true,
            repetition: true,
            nextReview: true,
            performanceAvg: true,
          },
        });

        const activities = await tx.activityLog.findMany({
          where: {
            userId: user?.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        });

        return {
          stats,
          cardsReviewToday,
          activities,
        };
      });

      return c.json(
        {
          code: 200,
          data: result,
          message: null,
        },
        200
      );
    } catch (error) {
      return handlePrismaError(c, error);
    }
  });

export default app;
