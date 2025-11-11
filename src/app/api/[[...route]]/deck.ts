import prisma from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { createDeckSchema } from "@/schemas/create-deck.schema";
import { editDeckSchema } from "@/schemas/edit-deck.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "./route";
import { handlePrismaError } from "@/utils/handle-prisma-error";

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
      })
    ),
    authMiddleware,
    readSecutiryMiddleware,
    async (c) => {
      const user = c.get("user");

      const { page = 1, perPage = 10, tags } = c.req.valid("query");

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
          },
        });

        return c.json(
          {
            code: 200,
            mesasge: "null",
            data: deck,
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

        await prisma.deck.create({
          data: {
            ...values,
            userId: user?.id as string,
          },
        });

        return c.json(
          {
            code: 201,
            message: "Deck criado com sucesso",
            data: null,
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

      try {
        await prisma.deck.update({
          where: {
            userId: user?.id,
            id: values.id,
          },
          data: {
            ...values,
          },
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

        await prisma.deck.update({
          where: {
            userId: user?.id,
            id: id,
          },
          data: {
            deletedAt: null,
          },
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
      const user = c.get("user");
      const { id } = c.req.valid("param");

      try {
        await prisma.deck.update({
          where: {
            userId: user?.id,
            id: id,
          },
          data: {
            deletedAt: new Date(),
          },
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
        await prisma.deck.delete({
          where: {
            userId: user?.id,
            id: id,
          },
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
