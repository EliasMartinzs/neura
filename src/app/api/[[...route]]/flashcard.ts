import prisma from "@/lib/db";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { createFlashcardSchema } from "@/schemas/create-flashcard.schema";
import { handlePrismaError } from "@/utils/handle-prisma-error";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "./route";

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
                },
              }
            : {}),
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

        await prisma.flashcard.create({
          data: {
            userId: user?.id as string,
            ...values,
          },
        });

        return c.json(
          {
            code: 201,
            message: "Flashcard criado com sucesso!",
            data: null,
          },
          201
        );
      } catch (error: any) {
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

        await prisma.flashcard.delete({
          where: {
            id: id,
            userId: user?.id,
          },
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
