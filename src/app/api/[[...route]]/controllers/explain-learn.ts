import { generateAnswerQuestion } from "@/features/explain-learn/utils/generate-answer-question";
import { generateExplainQuestionAi } from "@/features/explain-learn/utils/generate-explain-question-ai";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";
import { updateUserStats } from "@/lib/helpers/update-user-stats";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { writeSecurityMiddleware } from "@/middlewares/write";
import { createAnswerExplainQuestion } from "@/schemas/create-asnwer-explain-question.schema";
import { createExplainQuestion } from "@/schemas/create-explain-question.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "../route";
import { createActivity } from "@/lib/helpers/create-activity";
import { updateDailyStudyActivity } from "@/lib/helpers/update-daily-study-activity";

const app = new Hono<{
  Variables: AppVariables;
}>()
  .get(
    "/",
    authMiddleware,
    writeSecurityMiddleware,
    zValidator(
      "query",
      z.object({
        filter: z.enum(["COMPLETED", "PENDING", "ALL"]).optional(),
        page: z.coerce.number().optional(),
        perPage: z.coerce.number().optional(),
      })
    ),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const { filter, page = 1, perPage = 10 } = c.req.valid("query");

        const isValidFilter = filter === "COMPLETED" || filter === "PENDING";

        const total = await prisma.openStudySession.count({
          where: { userId },
        });

        const completed = await prisma.openStudySession.count({
          where: {
            userId,
            attempt: {
              isNot: null,
            },
          },
        });

        const pending = await prisma.openStudySession.count({
          where: {
            userId,
            attempt: {
              is: null,
            },
          },
        });

        const avg = await prisma.openAnswerAttempt.aggregate({
          where: {
            session: {
              userId,
            },
          },
          _avg: {
            score: true,
          },
        });

        const avgScore = avg._avg.score?.toFixed(2) ?? 0;

        const questions = await prisma.openStudySession.findMany({
          where: {
            userId,
            ...(isValidFilter
              ? {
                  status: {
                    equals: filter,
                  },
                }
              : {}),
          },
          orderBy: {
            createdAt: "desc",
          },
          skip: (page - 1) * perPage,
          take: perPage,
          include: {
            attempt: true,
            question: true,
          },
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: questions,
            total,
            totalPages: Math.ceil(total / perPage),
            page,
            perPage,
            stats: {
              completed,
              pending,
              total,
              avg: Number(avgScore),
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
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator("json", createExplainQuestion),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const { topic, difficulty } = c.req.valid("json");

        const generatedQuestion = await generateExplainQuestionAi({
          topic,
          difficulty,
        });

        if (!generatedQuestion.data) {
          return c.json(
            {
              code: 500,
              message: generatedQuestion.message,
              data: null,
            },
            500
          );
        }

        const result = await prisma.$transaction(async (tx) => {
          const openSession = await tx.openStudySession.create({
            data: {
              userId,
              topic,
            },
          });

          await tx.openQuestion.create({
            data: {
              sessionId: openSession.id,
              content: generatedQuestion.data.content,
              difficulty: generatedQuestion.data.difficulty,
              idealAnswer: generatedQuestion.data.idealAnswer,
            },
          });

          await updateUserStats({
            client: tx,
            userId,
            data: {
              openStudyCount: {
                increment: 1,
              },
            },
          });

          await createActivity({
            userId,
            type: "CREATE_OPEN_QUESTION",
            client: tx,
          });

          return {
            sessionId: openSession.id,
          };
        });

        return c.json({
          code: 201,
          message: "Questão criada com sucesso.",
          data: {
            sessionId: result.sessionId,
          },
        });
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "review",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator("json", createAnswerExplainQuestion),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const { sessionId, userAnswer, content } = c.req.valid("json");

        const generatedAnswer = await generateAnswerQuestion({
          content,
          userAnswer,
        });

        if (!generatedAnswer.data) {
          return c.json(
            {
              code: 500,
              message: generatedAnswer.message,
              data: null,
            },
            500
          );
        }

        const result = await prisma.$transaction(async (tx) => {
          const answer = await tx.openAnswerAttempt.create({
            data: {
              sessionId,
              userAnswer,
              ...generatedAnswer.data,
            },
          });

          await tx.openStudySession.update({
            where: {
              id: answer.sessionId,
            },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          });

          await createActivity({
            userId,
            type: "ANSWER_OPEN_QUESTION",
            client: tx,
          });

          return answer;
        });

        await updateDailyStudyActivity({
          userId,
        });

        return c.json(
          {
            code: 201,
            message: null,
            data: result,
          },
          201
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .delete(
    "/",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator(
      "json",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      const userId = c.get("user")?.id as string;

      try {
        const { id } = c.req.valid("json");
        await prisma.$transaction(async (tx) => {
          await tx.openStudySession.delete({
            where: {
              id,
            },
          });
        });

        await updateUserStats({
          userId,
          data: {
            openStudyCount: {
              decrement: 1,
            },
          },
        });

        await createActivity({
          userId,
          type: "DELETE_OPEN_QUESTION",
        });

        return c.json(
          {
            code: 200,
            message: "Questaõ delatada com sucesso!",
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
