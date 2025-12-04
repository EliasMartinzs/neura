import prisma from "@/lib/db";
import { getBrasiliaDayRange } from "@/lib/helpers/get-brasilia-day-range";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { Hono } from "hono";
import { AppVariables } from "../route";

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

      const { start: startOfToday, end: endOfToday } = getBrasiliaDayRange(now);

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
              gte: startOfToday,
              lte: endOfToday,
            },
            deletedAt: null,
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

        const dailyStudy = await tx.dailyStudyActivity.findMany({
          where: {
            userId: user?.id as string,
          },
          select: {
            date: true,
            count: true,
          },
        });

        return {
          stats,
          cardsReviewToday,
          activities,
          dailyStudy,
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
  })
  .post("/stats", async (c) => {
    try {
      const userId = c.get("user")?.id as string;

      await prisma.userStats.create({
        data: {
          userId,
        },
      });

      return c.json(
        {
          message: null,
          data: null,
          code: 201,
        },
        201
      );
    } catch (error) {
      return handlePrismaError(c, error);
    }
  });

export default app;
