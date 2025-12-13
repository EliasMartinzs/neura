import prisma from "@/lib/db";
import { createActivity } from "@/lib/helpers/create-activity";
import { decrementBloomLevel } from "@/lib/helpers/decrement-bloom-level";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";
import { incrementBloomLevel } from "@/lib/helpers/increment-bloom-level";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { createDeckSchema } from "@/schemas/create-deck.schema";
import { editDeckSchema } from "@/schemas/edit-deck.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "../route";
import { Prisma } from "@prisma/client";

const app = new Hono<{
  Variables: AppVariables;
}>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        tags: z
          .union([z.string(), z.array(z.string())])
          .optional()
          .transform((val) => (typeof val === "string" ? [val] : val)),
        page: z.coerce.number().optional(),
        perPage: z.coerce.number().optional(),
        search: z.string().optional(),
      })
    ),
    authMiddleware,
    readSecutiryMiddleware,
    async (c) => {
      const user = c.get("user");

      const {
        page = 1,
        perPage = 10,
        tags,
        search = "",
      } = c.req.valid("query");

      try {
        const where = {
          userId: user?.id,
          ...(tags && tags.length > 0
            ? {
                tags: {
                  hasSome: tags,
                },
              }
            : {}),

          ...(search
            ? {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                  {
                    description: {
                      contains: search,
                      mode: Prisma.QueryMode.insensitive,
                    },
                  },
                ],
              }
            : {}),
          deletedAt: null,
        };

        const total = await prisma.deck.count({ where });

        const decks = await prisma.deck.findMany({
          where,
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * perPage,
          take: perPage,
          select: {
            id: true,
            name: true,
            color: true,
            description: true,
            tags: true,
            createdAt: true,
            difficulty: true,
            reviewCount: true,
            lastStudiedAt: true,
            flashcards: {
              select: {
                reviews: true,
                front: true,
                id: true,
                performanceAvg: true,
                nextReview: true,
              },
            },
            _count: {
              select: {
                flashcards: true,
              },
            },
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: decks,
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
  .get("/tags", authMiddleware, readSecutiryMiddleware, async (c) => {
    try {
      const user = c.get("user");

      const decks = await prisma.deck.findMany({
        where: {
          userId: user?.id,
          deletedAt: null,
        },
        select: {
          tags: true,
        },
      });

      const allTags = Array.from(new Set(decks.flatMap((deck) => deck.tags)));

      return c.json(
        {
          code: 200,
          message: null,
          data: allTags,
        },
        200
      );
    } catch (error) {
      return handlePrismaError(c, error);
    }
  })
  .get("/trash", authMiddleware, readSecutiryMiddleware, async (c) => {
    try {
      const user = c.get("user");

      const trash = await prisma.deck.findMany({
        where: {
          userId: user?.id,
          deletedAt: {
            not: null,
          },
        },
        orderBy: {
          deletedAt: "desc",
        },
        select: {
          id: true,
          name: true,
          color: true,
          difficulty: true,
          deletedAt: true,
        },
      });

      return c.json(
        {
          code: 200,
          message: null,
          data: trash,
        },
        200
      );
    } catch (error) {
      return handlePrismaError(c, error);
    }
  })
  .get(
    "/names",
    authMiddleware,
    readSecutiryMiddleware,
    zValidator(
      "query",
      z.object({
        hasFlashcard: z.coerce.boolean().optional(),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { hasFlashcard } = c.req.valid("query");

        const decks = await prisma.deck.findMany({
          where: {
            userId: user?.id,
            deletedAt: null,
            ...(hasFlashcard ? { flashcards: { some: {} } } : {}),
          },
          select: {
            id: true,
            name: true,
            color: true,
            difficulty: true,
            _count: {
              select: {
                flashcards: true,
              },
            },
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: decks,
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
    readSecutiryMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const user = c.get("user");

        const deck = await prisma.deck.findUnique({
          where: {
            id: id,
            userId: user?.id,
          },
          select: {
            color: true,
            createdAt: true,
            description: true,
            difficulty: true,
            flashcards: {
              include: {
                reviews: true,
              },
            },
            id: true,
            lastStudiedAt: true,
            name: true,
            reviewCount: true,
            tags: true,
            _count: {
              select: {
                flashcards: true,
                aIGeneratedCard: true,
              },
            },
            studySessions: {
              select: {
                wrongCount: true,
                correctCount: true,
                id: true,
              },
            },
          },
        });

        if (!deck) {
          return c.json(
            { code: 404, message: "Deck não encontrado", data: null },
            404
          );
        }

        // ✅ Cálculo da performance média do deck
        const allGrades: number[] = [];
        deck.flashcards.forEach((fc) => {
          fc.reviews.forEach((r) => {
            allGrades.push(r.grade);
          });
        });

        const averageGrade =
          allGrades.length > 0
            ? allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length
            : 0;

        const totalCorrect = deck.studySessions.reduce(
          (sum, s) => sum + s.correctCount,
          0
        );
        const totalWrong = deck.studySessions.reduce(
          (sum, s) => sum + s.wrongCount,
          0
        );
        const accuracyRate =
          totalCorrect + totalWrong > 0
            ? totalCorrect / (totalCorrect + totalWrong)
            : 0;

        return c.json(
          {
            code: 200,
            mesasge: "null",
            data: {
              ...deck,
              performance: {
                averageGrade,
                accuracyRate,
              },
            },
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
    zValidator("json", createDeckSchema),
    heavyWriteSecurityMiddleware,
    authMiddleware,
    async (c) => {
      try {
        const values = c.req.valid("json");
        const user = c.get("user");
        const userId = user?.id as string;

        const result = await prisma.$transaction(async (tx) => {
          const deck = await tx.deck.create({
            data: {
              ...values,
              userId,
            },
          });

          for (const tag of deck.tags) {
            await tx.userTagCount.upsert({
              where: { userId_tag: { userId, tag } },
              update: { count: { increment: 1 } },
              create: { userId, tag, count: 1 },
            });
          }

          const topTags = await tx.userTagCount.findMany({
            where: { userId },
            orderBy: { count: "desc" },
            take: 10,
            select: { tag: true, count: true },
          });

          const topTagsArray = topTags.map((t) => ({
            tag: String(t.tag),
            count: Number(t.count),
          }));

          await tx.userStats.upsert({
            where: { userId },
            update: {
              decksCount: { increment: 1 },
              mostStudiedCategories: topTagsArray,
            },
            create: {
              userId,
              decksCount: 1,
              mostStudiedCategories: topTagsArray,
            },
          });

          await createActivity({
            userId: userId,
            type: "CREATE_DECK",
          });

          return {
            id: deck.id,
          };
        });

        return c.json(
          {
            code: 201,
            message: "Deck criado com sucesso",
            data: result.id,
          },
          201
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .put(
    "/",
    zValidator("json", editDeckSchema),
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      const user = c.get("user");
      const values = c.req.valid("json");
      const userId = user?.id as string;

      try {
        await prisma.$transaction(async (tx) => {
          const oldDeck = await tx.deck.findUnique({
            where: {
              id: values.id,
            },
            select: { tags: true },
          });

          if (!oldDeck) {
            return c.json(
              {
                code: 404,
                message: "Registro não encontrado!",
                data: null,
              },
              404
            );
          }

          const oldTags = oldDeck.tags;
          const newTags = values.tags || [];

          const removedTags = oldDeck.tags.filter((t) => !newTags.includes(t));
          for (const tag of removedTags) {
            await tx.userTagCount.updateMany({
              where: { userId, tag },
              data: { count: { decrement: 1 } },
            });
            await tx.userTagCount.deleteMany({
              where: { userId, tag, count: { lte: 0 } },
            });
          }

          const addedTags = newTags.filter((t) => !oldTags.includes(t));
          for (const tag of addedTags) {
            await tx.userTagCount.upsert({
              where: { userId_tag: { userId, tag } },
              update: { count: { increment: 1 } },
              create: { userId, tag, count: 1 },
            });
          }

          await tx.deck.update({
            where: {
              id: values.id,
            },
            data: {
              ...values,
            },
          });

          const topTags = await tx.userTagCount.findMany({
            where: { userId },
            orderBy: { count: "desc" },
            take: 10,
            select: { tag: true },
          });

          await tx.userStats.upsert({
            where: { userId },
            update: { mostStudiedCategories: topTags.map((t) => t.tag) },
            create: {
              userId,
              mostStudiedCategories: topTags.map((t) => t.tag),
            },
          });

          await createActivity({
            userId: userId,
            type: "UPDATE_DECK",
          });
        });

        return c.json(
          {
            code: 200,
            message: "Deck editado com sucesso!",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .put(
    "/restore-deck",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator(
      "json",
      z.object({
        id: z.string().min(1),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { id } = c.req.valid("json");
        const userId = user?.id as string;

        await prisma.$transaction(async (tx) => {
          const deck = await tx.deck.update({
            where: {
              userId,
              id,
            },
            data: {
              deletedAt: null,
            },
            include: {
              flashcards: true,
            },
          });

          await tx.flashcard.updateMany({
            where: {
              deckId: deck.id,
            },
            data: {
              deletedAt: null,
            },
          });

          const current = deck.flashcards.map((item) => ({
            level: item.bloomLevel as string,
          }));

          const grouped = current.reduce((acc, item) => {
            acc[item.level] = (acc[item.level] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          for (const [level, count] of Object.entries(grouped)) {
            await incrementBloomLevel({
              client: tx,
              userId,
              bloomLevel: level,
              count,
            });
          }

          for (const tag of deck.tags) {
            await tx.userTagCount.upsert({
              where: { userId_tag: { userId, tag } },
              update: { count: { increment: 1 } },
              create: { userId, tag, count: 1 },
            });
          }

          const topTags = await tx.userTagCount.findMany({
            where: { userId },
            orderBy: { count: "desc" },
            take: 10,
            select: { tag: true, count: true },
          });

          const topTagsArray = topTags.map((t) => ({
            tag: t.tag,
            count: t.count,
          }));

          await tx.userStats.upsert({
            where: { userId },
            update: {
              decksCount: { increment: 1 },
              flashcardsCreated: { increment: 1 },
              mostStudiedCategories: topTagsArray,
            },
            create: {
              userId,
              decksCount: 1,
              mostStudiedCategories: topTagsArray,
            },
          });

          await createActivity({
            userId: userId,
            type: "OTHER",
            message: "Deck restaurado com sucesso!",
          });
        });

        return c.json(
          {
            code: 200,
            message: "Deck restaurado com sucesso!",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .put(
    "/:id",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    async (c) => {
      try {
        const user = c.get("user");
        const { id } = c.req.valid("param");
        const userId = user?.id as string;

        await prisma.$transaction(async (tx) => {
          const deck = await tx.deck.findUnique({
            where: { id: id },
            select: { tags: true, id: true, flashcards: true },
          });

          if (!deck) {
            return c.json(
              {
                code: 404,
                message: "Registro não encontrado",
                data: null,
              },
              404
            );
          }

          const current = deck.flashcards.map((item) => ({
            level: item.bloomLevel as string,
          }));

          const grouped = current.reduce((acc, item) => {
            acc[item.level] = (acc[item.level] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          for (const [level, count] of Object.entries(grouped)) {
            await decrementBloomLevel({
              client: tx,
              userId: user!.id,
              bloomLevel: level,
            });
          }

          for (const tag of deck.tags) {
            await tx.userTagCount.updateMany({
              where: { userId, tag },
              data: { count: { decrement: 1 } },
            });

            await tx.userTagCount.deleteMany({
              where: { userId, tag, count: { lte: 0 } },
            });
          }

          await tx.deck.update({
            where: { id },
            data: { deletedAt: new Date() },
          });

          await tx.flashcard.updateMany({
            where: {
              deckId: deck.id,
            },
            data: {
              deletedAt: new Date(),
            },
          });

          const topTags = await tx.userTagCount.findMany({
            where: { userId },
            orderBy: { count: "desc" },
            take: 10,
            select: { tag: true },
          });

          await tx.userStats.update({
            where: { userId },
            data: {
              decksCount: { decrement: 1 },
              flashcardsCreated: { decrement: 1 },
              mostStudiedCategories: topTags.map((t) => t.tag),
            },
          });

          await createActivity({
            userId: userId,
            type: "OTHER",
            message: "Deck movido para a lixeira!",
          });
        });

        return c.json(
          {
            code: 200,
            message: "Deck movido para a lixeira!",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .delete(
    "/",
    authMiddleware,
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()).default([]),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { ids } = c.req.valid("json");

      try {
        await prisma.deck.deleteMany({
          where: {
            userId: user?.id,
            id: {
              in: ids,
            },
          },
        });

        await createActivity({
          userId: user?.id as string,
          type: "OTHER",
          message: "Deletado multiplos decks",
        });

        return c.json(
          {
            code: 200,
            message: "Todos os decks deletados com sucesso!",
            data: null,
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
    heavyWriteSecurityMiddleware,
    zValidator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.valid("param");

      try {
        await prisma.$transaction(async (tx) => {
          const flashcards = await tx.flashcard.findMany({
            where: { deckId: id, userId: user?.id },
            select: { bloomLevel: true },
          });

          for (const card of flashcards) {
            if (card.bloomLevel) {
              await decrementBloomLevel({
                client: tx,
                userId: user?.id as string,
                bloomLevel: card.bloomLevel,
              });
            }
          }

          await tx.deck.delete({
            where: {
              userId: user?.id,
              id: id,
            },
          });

          // 4️⃣ Registrar atividade
          await createActivity({
            userId: user?.id as string,
            type: "DELETE_DECK",
            client: tx,
          });
        });

        return c.json(
          {
            code: 200,
            message: "Deck deletado com sucesso!",
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
