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
        return c.json(
          {
            code: 500,
            message: `Houve um erro, tente novamente`,
            data: null,
          },
          500
        );
      }
    }
  )
  .get("/tags", authMiddleware, readSecutiryMiddleware, async (c) => {
    try {
      const user = c.get("user");

      const decks = await prisma.deck.findMany({
        where: {
          userId: user?.id,
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
      return c.json(
        {
          code: 500,
          message: `Houve um erro, tente novamente`,
          data: null,
        },
        500
      );
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
      return c.json(
        {
          code: 500,
          message: "Houve um erro, tente novamente!",
          data: null,
        },
        500
      );
    }
  })
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
        return c.json(
          {
            code: 500,
            message: "Houve um erro ao criar o deck, tente novamente",
            data: null,
          },
          500
        );
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
            code: 201,
            message: "Deck editado com sucesso!",
            data: null,
          },
          201
        );
      } catch (error) {
        return c.json(
          {
            code: 500,
            message: "Houve um erro, tente novamnte!",
            data: null,
          },
          500
        );
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
            code: 201,
            message: "Deck movido para a lixeira!",
            data: null,
          },
          500
        );
      } catch (error) {
        return c.json(
          {
            code: 500,
            message: "Houve um erro, tente novamente!",
            data: null,
          },
          500
        );
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
            code: 201,
            message: "Todos os decks deletados com sucesso!",
            data: null,
          },
          500
        );
      } catch (error) {
        return c.json(
          {
            code: 500,
            message: "Houve um erro, tente novamente!",
            data: null,
          },
          500
        );
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
            code: 201,
            message: "Deck deletado com sucesso!",
            data: null,
          },
          500
        );
      } catch (error) {
        return c.json(
          {
            code: 500,
            message: "Houve um erro, tente novamente!",
            data: null,
          },
          500
        );
      }
    }
  );

export default app;
