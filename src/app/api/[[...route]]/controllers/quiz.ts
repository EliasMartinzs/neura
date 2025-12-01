import { generateQuizAI } from "@/features/quiz/utils/generate-quiz-ai";
import prisma from "@/lib/db";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import { readSecutiryMiddleware } from "@/middlewares/read";
import { answerQuizSchema } from "@/schemas/answer-quiz.schema";
import { createQuizSchema } from "@/schemas/create-quiz.schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import { AppVariables } from "../route";
import { createActivity } from "@/lib/helpers/create-activity";
import { updateDailyStudyActivity } from "@/lib/helpers/update-daily-study-activity";

const app = new Hono<{ Variables: AppVariables }>()
  .post(
    "/",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator("json", createQuizSchema),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const body = c.req.valid("json");

        // 1) Criar a sessão
        const session = await prisma.quizSession.create({
          data: {
            userId,
            status: "ABANDONED",
            ...body,
          },
        });

        // 2) Criar os steps
        await prisma.quizStep.createMany({
          data: [
            { sessionId: session.id, stepType: "CONCEPT" },
            { sessionId: session.id, stepType: "EXAMPLE" },
            { sessionId: session.id, stepType: "COMPARISON" },
            { sessionId: session.id, stepType: "APPLICATION" },
          ],
        });

        // buscar steps criados (createMany não retorna rows)
        const fullSteps = await prisma.quizStep.findMany({
          where: { sessionId: session.id },
          orderBy: { createdAt: "asc" },
        });

        await createActivity({
          userId,
          type: "CREATE_QUIZ",
        });

        return c.json(
          {
            code: 201,
            message: null,
            data: {
              session,
              steps: fullSteps,
              nextStep: fullSteps[0],
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
    "/steps/:stepId/generate",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      try {
        const userId = c.get("user")!.id;

        const stepId = c.req.param("stepId");

        // 1) Buscar Step
        const step = await prisma.quizStep.findUnique({
          where: { id: stepId },
          include: {
            session: true,
            question: {
              include: { options: true, explanation: true },
            },
          },
        });

        if (!step)
          return c.json(
            { message: "Step não encontrado", code: 404, data: null },
            404
          );
        if (step.session.userId !== userId)
          return c.json(
            { message: "Não autorizado", code: 404, data: null },
            401
          );

        if (step.question)
          return c.json(
            {
              message: "Pergunta já gerada para este step",
              code: 400,
              data: null,
            },
            400
          );

        const session = step.session;

        // 2) Montar payload para IA
        const aiPayload = {
          topic: session.topic,
          subtopic: session.subtopic,
          difficulty: session.difficulty,
          style: session.style,
          explanationType: session.explanationType,
          stepType: step.stepType,
        };

        // 3) Gerar pergunta com IA
        const aiResponse = await generateQuizAI(aiPayload);

        const { content, options, explanation } = aiResponse;

        // 4) Criar a pergunta
        const question = await prisma.quizQuestion.create({
          data: {
            stepId: step.id,
            content,
          },
        });

        // 5) Criar opções
        await prisma.quizOption.createMany({
          data: options.map((o) => ({
            questionId: question.id,
            text: o.text,
            isCorrect: o.isCorrect,
          })),
        });

        // 6) Se tiver explicação → criar
        if (explanation) {
          await prisma.quizExplanation.create({
            data: {
              questionId: question.id,
              text: explanation.text,
              type: explanation.type,
            },
          });
        }

        // 7) Carregar tudo completo
        const fullQuestion = await prisma.quizQuestion.findUnique({
          where: { id: question.id },
          include: {
            options: true,
            explanation: true,
          },
        });

        return c.json(
          {
            code: 201,
            message: "Gerado com sucesso",
            data: {
              stepId: step.id,
              question: fullQuestion,
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
    "/steps/:stepId/answer",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator("json", answerQuizSchema),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const stepId = c.req.param("stepId");
        const { optionId } = c.req.valid("json");

        // 1) Buscar Step com tudo necessário
        const step = await prisma.quizStep.findUnique({
          where: { id: stepId },
          include: {
            session: true,
            question: {
              include: { options: true },
            },
          },
        });

        if (!step)
          return c.json(
            { message: "Step não encontrado", code: 404, data: null },
            404
          );

        if (step.session.userId !== userId)
          return c.json(
            { message: "Não autorizado", code: 401, data: null },
            401
          );

        if (!step.question)
          return c.json(
            {
              message: "Step ainda não possui pergunta",
              code: 400,
              data: null,
            },
            400
          );

        // 2) Verificar opção
        const chosen = step.question.options.find((o) => o.id === optionId);

        if (!chosen)
          return c.json(
            {
              message: "Opção inválida para esta pergunta",
              code: 400,
              data: null,
            },
            400
          );

        const isCorrect = chosen.isCorrect;

        // 3) Atualizar o step com a resposta
        await prisma.quizStep.update({
          where: { id: step.id },
          data: {
            answeredAt: new Date(),
            userAnswerId: optionId,
            isCorrect,
          },
        });

        // 4) Buscar próximo step
        const nextStep = await prisma.quizStep.findFirst({
          where: {
            sessionId: step.sessionId,
            answeredAt: null,
          },
          orderBy: {
            createdAt: "asc",
          },
        });

        // 5) Se não existe próximo → finalizar sessão
        if (!nextStep) {
          await prisma.quizSession.update({
            where: { id: step.sessionId },
            data: { completedAt: new Date(), status: "COMPLETED" },
          });
        }

        await createActivity({
          userId,
          type: "ANSWER_QUIZ",
        });

        await updateDailyStudyActivity({
          userId,
        });

        return c.json(
          {
            code: 200,
            message: null,
            data: {
              isCorrect,
              nextStep: nextStep ?? null,
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
    "/reset",
    authMiddleware,
    heavyWriteSecurityMiddleware,
    zValidator(
      "json",
      z.object({
        sessionId: z.string(),
      })
    ),
    async (c) => {
      try {
        const userId = c.get("user")!.id;
        const { sessionId } = c.req.valid("json");

        // Buscar sessão para validação
        const session = await prisma.quizSession.findUnique({
          where: { id: sessionId },
          include: { steps: true },
        });

        if (!session) {
          return c.json({
            code: 404,
            message: "Sessão não encontrada",
            data: null,
          });
        }

        if (session.userId !== userId) {
          return c.json({
            code: 401,
            message: "Não autorizado",
            data: null,
          });
        }

        await prisma.$transaction(async (tx) => {
          await tx.quizExplanation.deleteMany({
            where: {
              question: {
                step: { sessionId },
              },
            },
          });

          await tx.quizOption.deleteMany({
            where: {
              question: {
                step: { sessionId },
              },
            },
          });

          await tx.quizQuestion.deleteMany({
            where: {
              step: { sessionId },
            },
          });

          await tx.quizStep.deleteMany({
            where: { sessionId },
          });

          await tx.quizStep.createMany({
            data: [
              { sessionId: session.id, stepType: "CONCEPT" },
              { sessionId: session.id, stepType: "EXAMPLE" },
              { sessionId: session.id, stepType: "COMPARISON" },
              { sessionId: session.id, stepType: "APPLICATION" },
            ],
          });

          await tx.quizSession.update({
            where: { id: sessionId },
            data: {
              completedAt: null,
              status: "ACTIVE",
            },
          });
        });

        const freshSession = await prisma.quizSession.findUnique({
          where: {
            id: sessionId,
          },
          include: {
            steps: {
              include: {
                question: {
                  include: {
                    explanation: true,
                  },
                },
                userAnswer: true,
              },
            },
          },
        });

        return c.json({
          code: 200,
          message: "Sessão resetada com sucesso",
          data: freshSession,
        });
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .post(
    "/abandon",
    zValidator(
      "json",
      z.object({
        sessionId: z.string(),
      })
    ),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const { sessionId } = c.req.valid("json");

        await prisma.quizSession.update({
          where: {
            id: sessionId,
          },
          data: {
            status: "ABANDONED",
          },
        });

        await createActivity({
          userId,
          type: "OTHER",
          message: "Abandonou um quiz",
        });

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
  .get(
    "/",
    authMiddleware,
    readSecutiryMiddleware,
    zValidator(
      "query",
      z.object({
        status: z.enum(["ALL", "ACTIVE", "COMPLETED", "ABANDONED"]),
        page: z.coerce.number().optional(),
        perPage: z.coerce.number().optional(),
      })
    ),
    async (c) => {
      try {
        const userId = c.get("user")?.id as string;
        const { status = "ALL", page = 1, perPage = 10 } = c.req.valid("query");

        const where = {
          userId,
          ...(status !== "ALL"
            ? {
                status: {
                  equals: status,
                },
              }
            : {}),
        };

        const total = await prisma.quizSession.count({ where });

        const quiz = await prisma.quizSession.findMany({
          where,
          include: {
            steps: {
              include: {
                question: {
                  include: {
                    explanation: true,
                  },
                },
                userAnswer: true,
              },
            },
          },
          skip: (page - 1) * perPage,
          take: perPage,
        });

        return c.json({
          code: 200,
          message: null,
          data: quiz,
          total,
          totalPages: Math.ceil(total / perPage),
          page,
          perPage,
        });
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .get(
    "/:id",
    authMiddleware,
    readSecutiryMiddleware,
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        const quiz = await prisma.quizSession.findUnique({
          where: {
            id,
          },
          include: {
            steps: {
              include: {
                question: {
                  include: {
                    explanation: true,
                  },
                },
                userAnswer: true,
              },
            },
          },
        });

        return c.json({
          code: 200,
          message: null,
          data: quiz,
        });
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
      try {
        const userId = c.get("user")?.id as string;
        const { id } = c.req.valid("param");

        await prisma.$transaction(async (tx) => {
          await tx.quizSession.delete({
            where: {
              id,
            },
          });

          await createActivity({
            userId,
            client: tx,
            type: "DELETE_QUIZ",
          });
        });

        return c.json(
          {
            code: 200,
            data: null,
            message: "Quiz deletado com sucesso!",
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  );

export default app;
