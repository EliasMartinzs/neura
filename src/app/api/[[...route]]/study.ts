import prisma from "@/lib/db";
import { updateUserStats } from "@/lib/update-user-stats";
import { updateUserAccuracyRate } from "@/lib/user-stats";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { reviewFlashcardSchema } from "@/schemas/review-flashcard";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z, { promise } from "zod";
import { AppVariables } from "./route";

const app = new Hono<{
  Variables: AppVariables;
}>()
  .post(
    "/start",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        deckId: z.string(),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { deckId } = c.req.valid("json");

        const lastSession = await prisma.studySession.findFirst({
          where: {
            deckId,
            userId: user?.id!,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        if (lastSession && lastSession.completed) {
          return c.json(
            {
              code: 400,
              message: "Essa seção de estudo já foi finalizada.",
              data: {
                sessionId: lastSession.id,
                deckId: lastSession.deckId,
                status: "completed",
              },
            },
            400
          );
        }

        if (lastSession && !lastSession.completed) {
          return c.json(
            {
              code: 200,
              message: "Você já possui uma seção ativa. Continuando...",
              data: {
                sessionId: lastSession.id,
                deckId: lastSession.deckId,
                status: "active",
              },
            },
            200
          );
        }

        const session = await prisma.studySession.create({
          data: {
            userId: user?.id!,
            deckId,
            completed: false,
          },
        });

        return c.json(
          {
            code: 201,
            message: "Nova seção de estudo criada!",
            data: {
              sessionId: session.id,
              deckId: session.deckId,
              status: "created",
            },
          },
          201
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "/review",
    authMiddleware,
    zValidator("json", reviewFlashcardSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const { flashcardId, grade, timeToAnswer, notes, sessionId } =
          c.req.valid("json");

        await prisma.$transaction(async (tx) => {
          const card = await tx.flashcard.findUnique({
            where: { id: flashcardId },
          });

          if (!card) return c.json({ error: "Card não encontrado." }, 404);

          let { easeFactor, interval, repetition } = card;

          if (grade < 3) {
            repetition = 0;
            interval = 1;
          } else {
            if (repetition === 0) interval = 1;
            else if (repetition === 1) interval = 6;
            else interval = Math.round(interval * easeFactor);

            easeFactor =
              easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
            if (easeFactor < 1.3) easeFactor = 1.3;
            repetition += 1;
          }

          const today = new Date();
          const nextReview = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + interval
          );

          const reviews = await tx.flashcardReview.findMany({
            where: { flashcardId },
            orderBy: { reviewedAt: "desc" },
            take: 10,
          });
          const total = reviews.length;
          const correct = reviews.filter((r) => r.grade >= 3).length;
          const performanceAvg = total > 0 ? correct / total : 0;

          await tx.flashcard.update({
            where: { id: flashcardId },
            data: {
              easeFactor,
              interval,
              repetition,
              nextReview,
              lastReviewedAt: new Date(),
              performanceAvg,
            },
          }),
            await tx.flashcardReview.create({
              data: {
                flashcardId,
                sessionId,
                grade,
                timeToAnswer,
                notes,
              },
            }),
            await tx.deck.update({
              where: {
                id: card?.deckId!,
              },
              data: {
                reviewCount: {
                  increment: 1,
                },
              },
            }),
            await tx.studySession.update({
              where: { id: sessionId },
              data: {
                correctCount: grade >= 3 ? { increment: 1 } : undefined,
                wrongCount: grade < 3 ? { increment: 1 } : undefined,
                currentIndex: { increment: 1 },
              },
            });
        });

        const isCorrect = grade >= 3;
        await updateUserAccuracyRate(user?.id!, isCorrect);

        return c.json(
          {
            code: 200,
            message: null,
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "/end",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        sessionId: z.string(),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { sessionId } = c.req.valid("json");

        await Promise.all([
          await prisma.studySession.update({
            where: { id: sessionId },
            data: { endedAt: new Date(), completed: true },
          }),
          await updateUserStats(user?.id!, {
            studiesCompleted: {
              increment: 1,
            },
          }),
        ]);

        return c.json(
          {
            code: 200,
            message: "Seção finalizada",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .get(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        const session = await prisma.studySession.findUnique({
          where: {
            id,
          },
          include: {
            deck: {
              include: {
                flashcards: {
                  where: {
                    deletedAt: null,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: session,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .get(
    "/summary/:id",
    authMiddleware,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        const session = await prisma.studySession.findUnique({
          where: { id },
          include: {
            deck: {
              include: {
                flashcards: {
                  where: { deletedAt: null },
                },
              },
            },
            flashcardReviews: true,
          },
        });

        if (!session) {
          return c.json(
            { code: 404, message: "Sessão não encontrada.", data: null },
            404
          );
        }

        const total = session.deck.flashcards.length;
        const reviewed = session.flashcardReviews.length;
        const remaining = total - reviewed;
        const progress = total > 0 ? reviewed / total : 0;
        const totalAnswered = session.correctCount + session.wrongCount;
        const accuracy =
          totalAnswered > 0 ? session.correctCount / totalAnswered : 0;

        if (reviewed >= total && !session.completed) {
          await prisma.studySession.update({
            where: { id: session.id },
            data: {
              completed: true,
              endedAt: new Date(),
            },
          });

          session.completed = true;
          session.endedAt = new Date();
        }

        const nextCard = session.deck.flashcards.find(
          (card) =>
            !session.flashcardReviews.some((r) => r.flashcardId === card.id) &&
            (!card.nextReview || card.nextReview <= new Date())
        );

        return c.json(
          {
            code: 200,
            message: null,
            data: {
              sessionId: session.id,
              deckId: session.deckId,
              deckTitle: session.deck.name,
              totalFlashcards: total,
              reviewedFlashcards: reviewed,
              remainingFlashcards: remaining,
              progress,
              correctCount: session.correctCount,
              wrongCount: session.wrongCount,
              nextCard: nextCard ?? null,
              completed: session.completed,
              endedAt: session.endedAt,
              accuracy: (accuracy * 100).toFixed(2),
            },
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .delete(
    "/:id",
    authMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        const result = await prisma.$transaction(async (tx) => {
          const deleted = await prisma.studySession.delete({
            where: {
              id,
            },
            select: {
              deck: {
                select: {
                  id: true,
                },
              },
            },
          });

          await prisma.flashcard.updateMany({
            where: {
              deckId: deleted.deck.id,
            },
            data: {
              easeFactor: 2.5,
              interval: 0,
              repetition: 0,
              lastReviewedAt: null,
              nextReview: null,
            },
          });

          await prisma.deck.update({
            where: {
              id: deleted.deck.id,
            },
            data: {
              reviewCount: 0,
            },
          });

          return deleted;
        });

        return c.json(
          {
            code: 200,
            message: "Seção de estudo resetada.",
            data: {
              deckId: result.deck.id,
            },
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  );

export default app;
