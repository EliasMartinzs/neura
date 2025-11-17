import { circleColors } from "@/constants/circle-colors";
import { generateFlashcardsAI } from "@/features/flashcard/utils/generate-flashcard-ai";
import prisma from "@/lib/db";
import { createActivity } from "@/lib/helpers/create-activity";
import { incrementBloomLevel } from "@/lib/helpers/increment-bloom-level";
import { updateUserStats } from "@/lib/update-user-stats";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { createFlashcardGenerationSchema } from "@/schemas/create-flashcard-generattion.schema";
import { createFlashcardSchema } from "@/schemas/create-flashcard.schema";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { zValidator } from "@hono/zod-validator";
import { $Enums, BloomLevel, FlashcardDifficulty } from "@prisma/client";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "./route";
import { decrementBloomLevel } from "@/lib/helpers/decrement-bloom-level";

const app = new Hono<{
  Variables: AppVariables;
}>()
  .get(
    "/",
    authMiddleware,
    readSecutiryMiddleware,
    zValidator(
      "query",
      z.object({
        deck: z.string().optional(),
        page: z.coerce.number().optional(),
        perPage: z.coerce.number().optional(),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { deck, page = 1, perPage = 10 } = c.req.valid("query");

        const where = {
          userId: user?.id,
          ...(deck
            ? {
                deck: {
                  name: deck,
                  deletedAt: null,
                },
              }
            : {
                deletedAt: null,
              }),
        };

        const total = await prisma.flashcard.count({ where });

        const flashcards = await prisma.flashcard.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * perPage,
          take: perPage,
          include: {
            reviews: true,
            deck: true,
            _count: {
              select: {
                reviews: true,
              },
            },
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: flashcards,
            total,
            totalPages: Math.ceil(total / perPage),
            page,
            perPage,
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
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    authMiddleware,
    readSecutiryMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const { id } = c.req.valid("param");

        const flashcard = await prisma.flashcard.findUnique({
          where: {
            userId: user?.id,
            id: id,
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: flashcard,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "/",
    zValidator("json", createFlashcardSchema),
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const values = c.req.valid("json");

        const result = await prisma.$transaction(async (tx) => {
          const flashcard = await tx.flashcard.create({
            data: {
              userId: user?.id as string,
              ...values,
            },
          });

          await tx.userStats.update({
            where: {
              userId: user?.id,
            },
            data: {
              flashcardsCreated: { increment: 1 },
            },
          });

          await incrementBloomLevel(
            tx,
            user?.id as string,
            flashcard.bloomLevel as string
          );

          await tx.flashcardReview.deleteMany({
            where: {
              flashcard: {
                deckId: values.deckId,
              },
            },
          });

          await tx.studySession.deleteMany({
            where: { deckId: values.deckId },
          });

          await tx.flashcard.updateMany({
            where: {
              deckId: values.deckId,
            },
            data: {
              easeFactor: 2.5,
              interval: 0,
              repetition: 0,
              lastReviewedAt: null,
              nextReview: null,
            },
          });

          const deck = await tx.deck.update({
            where: { id: values.deckId },
            data: {
              reviewCount: 0,
              lastStudiedAt: null,
            },
          });

          await createActivity({
            userId: user?.id as string,
            type: "CREATE_FLASHCARD",
            client: tx,
          });

          return deck;
        });

        return c.json(
          {
            code: 201,
            message: result
              ? "Sua sessão atual foi reiniciada pois o deck foi atualizado."
              : "Flashcard criado com sucesso!",
            data: null,
          },
          201
        );
      } catch (error: any) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "/generate",
    zValidator("json", createFlashcardGenerationSchema),
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const values = c.req.valid("json");

        const generated = await generateFlashcardsAI(values);

        await prisma.$transaction(async (tx) => {
          const generationRecord = await prisma.aIGeneratedCard.create({
            data: {
              userId: user?.id!,
              deckId: values.deckId,
              prompt: values.prompt,
              response: generated,
            },
          });

          await prisma.flashcard.createMany({
            data: generated.map((f, i) => ({
              ...f,
              userId: user?.id!,
              deckId: values.deckId,
              generatedById: generationRecord.id,
              difficulty: f.difficulty as FlashcardDifficulty,
              bloomLevel: f.bloomLevel as BloomLevel,
              color: circleColors[i].background,
            })),
          });

          await prisma.flashcardReview.deleteMany({
            where: {
              flashcard: {
                deckId: values.deckId,
              },
            },
          });

          await updateUserStats(user?.id!, {
            flashcardsCreated: { increment: generated.length },
          });

          await prisma.studySession.deleteMany({
            where: { deckId: values.deckId },
          });

          await prisma.flashcard.updateMany({
            where: {
              deckId: values.deckId,
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
            where: { id: values.deckId },
            data: {
              lastStudiedAt: null,
              reviewCount: 0,
            },
          });

          const activeSession = await prisma.studySession.findFirst({
            where: {
              deckId: values.deckId,
              userId: user?.id,
              completed: false,
            },
          });

          if (activeSession) {
            await prisma.studySession.update({
              where: { id: activeSession.id },
              data: { completed: true, endedAt: new Date() },
            });
          }

          await createActivity({
            userId: user?.id as string,
            type: "CREATE_FLASHCARD_BY_AI",
            client: tx,
          });
        });

        return c.json(
          {
            code: 201,
            message: `Gerado ${values.amount} sobre ${values.topic}`,
            data: null,
          },
          201
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      try {
        const user = c.get("user");
        const { id } = c.req.valid("param");

        await prisma.$transaction(async (tx) => {
          const flashcard = await tx.flashcard.findUnique({
            where: {
              id: id,
              userId: user?.id,
            },
            select: {
              easeFactor: true,
              interval: true,
              repetition: true,
              deckId: true,
              bloomLevel: true,
            },
          });

          if (!flashcard) {
            return c.json(
              {
                code: 404,
                message: "Registro não encontrado!",
                data: null,
              },
              404
            );
          }

          await tx.flashcardReview.deleteMany({
            where: {
              flashcard: {
                deckId: flashcard.deckId,
              },
            },
          });

          await tx.deck.update({
            where: {
              id: flashcard?.deckId!,
            },
            data: {
              reviewCount: 0,
            },
          });

          await tx.userStats.update({
            where: {
              userId: user?.id,
            },
            data: {
              flashcardsCreated: { decrement: 1 },
            },
          });

          await tx.studySession.deleteMany({
            where: { deckId: flashcard.deckId! },
          });

          await tx.flashcard.updateMany({
            where: {
              deckId: flashcard.deckId,
            },
            data: {
              easeFactor: 2.5,
              interval: 0,
              repetition: 0,
              lastReviewedAt: null,
              nextReview: null,
            },
          });

          await decrementBloomLevel({
            userId: user?.id as string,
            client: tx,
            bloomLevel: flashcard?.bloomLevel as $Enums.BloomLevel,
          });

          await tx.flashcard.delete({
            where: {
              id,
            },
          });

          await createActivity({
            userId: user?.id as string,
            type: "DELETE_FLASHCARD",
            client: tx,
          });
        });

        return c.json(
          {
            code: 200,
            message: "Flashcard deletado com sucesso!",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  );

export default app;
