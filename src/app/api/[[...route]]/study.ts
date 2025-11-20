import prisma from "@/lib/db";
import { updateUserStats } from "@/lib/update-user-stats";
import { updateUserAccuracyRate } from "@/lib/user-stats";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { reviewFlashcardSchema } from "@/schemas/review-flashcard";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "./route";
import { getBrasiliaDayRange } from "@/lib/helpers/get-brasilia-day-range";
import { createActivity } from "@/lib/helpers/create-activity";

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

        // 1. Procurar sessão ativa NÃO FINALIZADA
        const activeSession = await prisma.studySession.findFirst({
          where: {
            userId: user?.id!,
            deckId,
            completed: false,
          },
          include: {
            flashcardReviews: true,
          },
          orderBy: { createdAt: "desc" },
        });

        // 2. Se existe sessão ativa -> continuar nela
        if (activeSession) {
          return c.json(
            {
              code: 200,
              message: "Sessão retomada.",
              data: {
                sessionId: activeSession.id,
                deckId,
              },
            },
            200
          );
        }

        // 3. Buscar todos os flashcards do deck
        const allFlashcards = await prisma.flashcard.findMany({
          where: {
            deckId,
            deletedAt: null,
          },
          orderBy: { createdAt: "asc" },
        });

        // 4. Verificar quais já foram revisados em sessões anteriores
        const reviewedIds = await prisma.flashcardReview
          .findMany({
            where: {
              flashcardId: { in: allFlashcards.map((fc) => fc.id) },
            },
            select: { flashcardId: true },
          })
          .then((res) => res.map((r) => r.flashcardId));

        const pendingFlashcards = allFlashcards.filter(
          (fc) => !reviewedIds.includes(fc.id)
        );

        // 5. Se não há flashcards pendentes -> sessão completa
        if (pendingFlashcards.length === 0) {
          return c.json(
            {
              code: 200,
              message: "Todos os flashcards deste deck já foram revisados.",
              data: null,
            },
            200
          );
        }

        // 6. Criar nova sessão apenas para os flashcards pendentes
        const newSession = await prisma.$transaction(async (tx) => {
          const session = await tx.studySession.create({
            data: {
              userId: user?.id!,
              deckId,
              completed: false,
              currentIndex: 0,
              correctCount: 0,
              wrongCount: 0,
            },
          });

          // Snapshot da sessão
          await tx.sessionFlashcard.createMany({
            data: pendingFlashcards.map((fc) => ({
              sessionId: session.id,
              flashcardId: fc.id,
            })),
            skipDuplicates: true,
          });

          await createActivity({
            userId: user?.id!,
            type: "STUDY_SESSION_STARTED",
            message: `Iniciou sessão no deck.`,
          });

          return session;
        });

        return c.json(
          {
            code: 201,
            message: "Nova sessão criada.",
            data: {
              sessionId: newSession.id,
              deckId,
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
              sessionId: sessionId,
            },
          });

          await tx.flashcardReview.create({
            data: {
              flashcardId,
              sessionId,
              grade,
              timeToAnswer,
              notes,
            },
          });

          await tx.deck.update({
            where: {
              id: card?.deckId!,
            },
            data: {
              reviewCount: {
                increment: 1,
              },
            },
          });

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

        await prisma.studySession.update({
          where: { id: sessionId },
          data: { endedAt: new Date(), completed: true },
        });

        await updateUserStats(user?.id!, {
          studiesCompleted: {
            increment: 1,
          },
        });

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
  .get("/reviews", authMiddleware, readSecutiryMiddleware, async (c) => {
    try {
      const userId = c.get("user")?.id as string;

      const now = new Date();

      const { start: startOfToday, end: endOfToday } = getBrasiliaDayRange(now);

      const totalFlashcards = await prisma.flashcard.count({
        where: { userId },
      });

      const urgent = await prisma.flashcard.findMany({
        where: {
          userId,
          nextReview: { lt: startOfToday },
          deletedAt: null,
        },
        orderBy: { nextReview: "asc" },
        select: {
          deckId: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          color: true,
          difficulty: true,
          deletedAt: true,
          front: true,
          back: true,
          topic: true,
          subtopic: true,
          bloomLevel: true,
          note: true,
          generatedById: true,
          easeFactor: true,
          interval: true,
          repetition: true,
          nextReview: true,
          lastReviewedAt: true,
          performanceAvg: true,
          sessionId: true,
        },
      });

      const today = await prisma.flashcard.findMany({
        where: {
          userId,
          nextReview: {
            gte: startOfToday,
            lte: endOfToday,
          },
          deletedAt: null,
        },
        orderBy: { nextReview: "asc" },
        select: {
          deckId: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          color: true,
          difficulty: true,
          deletedAt: true,
          front: true,
          back: true,
          topic: true,
          subtopic: true,
          bloomLevel: true,
          note: true,
          generatedById: true,
          easeFactor: true,
          interval: true,
          repetition: true,
          nextReview: true,
          lastReviewedAt: true,
          performanceAvg: true,
          sessionId: true,
        },
      });

      const upcoming = await prisma.flashcard.findMany({
        where: {
          userId,
          nextReview: {
            gt: endOfToday,
          },
          deletedAt: null,
        },
        orderBy: { nextReview: "asc" },
        select: {
          deckId: true,
          id: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          color: true,
          difficulty: true,
          deletedAt: true,
          front: true,
          back: true,
          topic: true,
          subtopic: true,
          bloomLevel: true,
          note: true,
          generatedById: true,
          easeFactor: true,
          interval: true,
          repetition: true,
          nextReview: true,
          lastReviewedAt: true,
          performanceAvg: true,
          sessionId: true,
        },
      });

      const completedData = await prisma.flashcardReview.findMany({
        where: {
          flashcard: {
            userId,
            deletedAt: null,
          },
          reviewedAt: {
            gte: startOfToday,
            lte: endOfToday,
          },
        },
        orderBy: { reviewedAt: "desc" },
        include: {
          flashcard: {
            select: {
              deckId: true,
              id: true,
              createdAt: true,
              updatedAt: true,
              userId: true,
              color: true,
              difficulty: true,
              deletedAt: true,
              front: true,
              back: true,
              topic: true,
              subtopic: true,
              bloomLevel: true,
              note: true,
              generatedById: true,
              easeFactor: true,
              interval: true,
              repetition: true,
              nextReview: true,
              lastReviewedAt: true,
              performanceAvg: true,
              sessionId: true,
            },
          },
        },
      });

      const completed = completedData.map((item) => ({
        id: item.flashcard.id,
        front: item.flashcard.front,
        topic: item.flashcard.topic,
        subtopic: item.flashcard.subtopic,
        difficulty: item.flashcard.difficulty,
        bloomLevel: item.flashcard.bloomLevel,
        color: item.flashcard.color,
        easeFactor: item.flashcard.easeFactor,
        interval: item.flashcard.interval,
        repetition: item.flashcard.repetition,
        nextReview: item.flashcard.nextReview,
        lastReviewedAt: item.flashcard.lastReviewedAt,
        performanceAvg: item.flashcard.performanceAvg,
        deckId: item.flashcard.deckId,
        createdAt: item.flashcard.createdAt,
        updatedAt: item.flashcard.updatedAt,
        userId: item.flashcard.userId,
        deletedAt: item.flashcard.deletedAt,
        back: item.flashcard.back,
        note: item.flashcard.note,
        generatedById: item.flashcard.generatedById,
        sessionId: item.flashcard.sessionId,
      }));

      return c.json(
        {
          code: 200,
          message: null,
          data: {
            urgent,
            today,
            upcoming,
            completed,
            totalFlashcards,
          },
        },
        200
      );
    } catch (error) {
      return handlePrismaError(c, error);
    }
  })
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

        // 🔒 REGRA: sessão finalizada NÃO reabre
        const sessionCreatedAt = session.createdAt;

        // Só contam flashcards que EXISTIAM quando a sessão começou
        const flashcardsValidos = session.deck.flashcards.filter(
          (card) => card.createdAt <= sessionCreatedAt
        );

        const total = flashcardsValidos.length;

        const reviewed = session.flashcardReviews.filter((r) =>
          flashcardsValidos.some((card) => card.id === r.flashcardId)
        ).length;

        const remaining = total - reviewed;

        const progress = total > 0 ? reviewed / total : 0;

        const totalAnswered = session.correctCount + session.wrongCount;
        const accuracy =
          totalAnswered > 0 ? session.correctCount / totalAnswered : 0;

        // 🟢 FECHAR sessão quando tudo foi revisado
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

        // 🔍 Próximo card permitido
        const nextCard = flashcardsValidos.find(
          (card) =>
            !session.flashcardReviews.some((r) => r.flashcardId === card.id)
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
  );

export default app;
