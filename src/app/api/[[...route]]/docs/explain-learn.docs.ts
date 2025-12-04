// docs/explain-learn.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const explainLearnDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/explain-learn": {
    get: {
      summary: "Listar sessões de Explain Learn",
      description:
        "Retorna todas as sessões de estudo tipo 'Explain Learn' do usuário, com filtros opcionais por COMPLETED, PENDING ou ALL, e estatísticas agregadas.",
      tags: ["ExplainLearn"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "filter",
          in: "query",
          schema: { type: "string", enum: ["COMPLETED", "PENDING", "ALL"] },
          required: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "number" },
          required: false,
        },
        {
          name: "perPage",
          in: "query",
          schema: { type: "number" },
          required: false,
        },
      ],
      responses: {
        "200": {
          description: "Sessões retornadas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: { type: "array", items: { type: "object" } },
                  total: { type: "number" },
                  totalPages: { type: "number" },
                  page: { type: "number" },
                  perPage: { type: "number" },
                  stats: {
                    type: "object",
                    properties: {
                      completed: { type: "number" },
                      pending: { type: "number" },
                      total: { type: "number" },
                      avg: { type: "number" },
                    },
                  },
                },
                required: [
                  "code",
                  "message",
                  "data",
                  "total",
                  "totalPages",
                  "page",
                  "perPage",
                  "stats",
                ],
              },
            },
          },
        },
      },
    },

    post: {
      summary: "Criar nova questão Explain Learn",
      description:
        "Gera uma nova questão Explain Learn baseada em IA para um tópico e dificuldade específicos.",
      tags: ["ExplainLearn"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                topic: { type: "string" },
                difficulty: { type: "string" },
              },
              required: ["topic", "difficulty"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Questão criada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: {
                    type: "string",
                    example: "Questão criada com sucesso.",
                  },
                  data: {
                    type: "object",
                    properties: { sessionId: { type: "string" } },
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "500": {
          description: "Erro ao gerar questão",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 500 },
                  message: { type: "string" },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },

    delete: {
      summary: "Deletar sessão Explain Learn",
      description: "Deleta uma sessão Explain Learn existente pelo ID.",
      tags: ["ExplainLearn"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { id: { type: "string" } },
              required: ["id"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Sessão deletada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Questão deletada com sucesso!",
                  },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },

  "/api/explain-learn/review": {
    post: {
      summary: "Responder questão Explain Learn",
      description:
        "Avalia a resposta do usuário para uma questão Explain Learn e atualiza o status da sessão.",
      tags: ["ExplainLearn"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                sessionId: { type: "string" },
                userAnswer: { type: "string" },
                content: { type: "string" },
              },
              required: ["sessionId", "userAnswer", "content"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Resposta registrada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: { type: "string", nullable: true },
                  data: { type: "object" },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "500": {
          description: "Erro ao gerar resposta",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 500 },
                  message: { type: "string" },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },
};
