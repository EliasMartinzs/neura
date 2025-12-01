import { circleColors } from "@/constants/circle-colors";
import { generateFlashcardsAI } from "@/features/flashcard/utils/generate-flashcard-ai";
import prisma from "@/lib/db";
import { createActivity } from "@/lib/helpers/create-activity";
import { decrementBloomLevel } from "@/lib/helpers/decrement-bloom-level";
import { incrementBloomLevel } from "@/lib/helpers/increment-bloom-level";
import { updateUserStats } from "@/lib/helpers/update-user-stats";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { createFlashcardGenerationSchema } from "@/schemas/create-flashcard-generattion.schema";
import { createFlashcardSchema } from "@/schemas/create-flashcard.schema";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";
import { zValidator } from "@hono/zod-validator";
import { BloomLevel, FlashcardDifficulty } from "@prisma/client";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "../route";
import { updateDailyStudyActivity } from "@/lib/helpers/update-daily-study-activity";

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

        await updateDailyStudyActivity({
          userId: user?.id as string,
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
        const userId = c.get("user")?.id as string;
        const values = c.req.valid("json");

        const result = await prisma.$transaction(async (tx) => {
          const flashcard = await tx.flashcard.create({
            data: {
              userId,
              easeFactor: 2.5,
              interval: 0,
              repetition: 0,
              nextReview: null,
              ...values,
            },
          });

          await updateUserStats({
            data: {
              flashcardsCreated: { increment: 1 },
            },
            userId,
          });

          await incrementBloomLevel({
            client: tx,
            userId,
            bloomLevel: flashcard.bloomLevel as string,
          });

          await createActivity({
            userId,
            type: "CREATE_FLASHCARD",
            client: tx,
          });

          return flashcard;
        });

        return c.json(
          {
            code: 201,
            message: "Flashcard criado com sucesso!",
            data: result,
          },
          201
        );
      } catch (error) {
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
        const userId = c.get("user")?.id as string;
        const values = c.req.valid("json");

        const generated = await generateFlashcardsAI(values);

        await prisma.$transaction(async (tx) => {
          const generationRecord = await prisma.aIGeneratedCard.create({
            data: {
              userId,
              deckId: values.deckId,
              prompt: values.prompt,
              response: generated,
            },
          });

          await prisma.flashcard.createMany({
            data: generated.map((f, i) => ({
              ...f,
              userId,
              deckId: values.deckId,
              generatedById: generationRecord.id,
              difficulty: f.difficulty as FlashcardDifficulty,
              bloomLevel: f.bloomLevel as BloomLevel,
              color: circleColors[i].background,
            })),
          });

          await updateUserStats({
            data: {
              flashcardsCreated: { increment: 1 },
            },
            userId,
          });

          await incrementBloomLevel({
            client: tx,
            userId,
            bloomLevel: values.bloomLevel as string,
            count: generated.length,
          });

          await createActivity({
            userId,
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
              id,
              userId: user?.id,
            },
            select: {
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

          // buscar acertos e erros do flashcard
          const reviews = await tx.flashcardReview.findMany({
            where: { flashcardId: id },
            select: {
              grade: true, // exemplo: 1 = erro, 2 = acerto
            },
          });

          const wrong = reviews.filter((r) => r.grade <= 1).length;
          const correct = reviews.filter((r) => r.grade >= 3).length;

          // remover somente as revisões desse flashcard
          await tx.flashcardReview.deleteMany({
            where: { flashcardId: id },
          });

          // atualizar estatísticas do usuário
          await tx.userStats.update({
            where: { userId: user?.id },
            data: {
              flashcardsCreated: { decrement: 1 },
              totalCorrectAnswers: { decrement: correct },
              totalWrongAnswers: { decrement: wrong },
            },
          });

          // decrementa bloom level em userStats
          await decrementBloomLevel({
            userId: user?.id as string,
            client: tx,
            bloomLevel: flashcard.bloomLevel as string,
          });

          // apagar o flashcard
          await tx.flashcard.delete({
            where: { id },
          });

          // registrar atividade
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
