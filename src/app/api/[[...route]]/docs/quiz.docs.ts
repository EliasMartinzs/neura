// docs/quiz.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const quizDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/quiz": {
    post: {
      summary: "Criar nova sessão de Quiz",
      description:
        "Cria uma nova sessão de quiz com steps iniciais (CONCEPT, EXAMPLE, COMPARISON, APPLICATION).",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                topic: { type: "string" },
                subtopic: { type: "string" },
                difficulty: { type: "string" },
                style: { type: "string" },
                explanationType: { type: "string" },
              },
              required: ["topic", "subtopic", "difficulty"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Sessão criada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "object",
                    properties: {
                      session: { type: "object" },
                      steps: { type: "array", items: { type: "object" } },
                      nextStep: { type: "object" },
                    },
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Listar sessões de Quiz",
      description:
        "Retorna todas as sessões de quiz do usuário, com filtro por status e paginação.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "status",
          in: "query",
          schema: {
            type: "string",
            enum: ["ALL", "ACTIVE", "COMPLETED", "ABANDONED"],
          },
          required: true,
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
                },
                required: [
                  "code",
                  "message",
                  "data",
                  "total",
                  "totalPages",
                  "page",
                  "perPage",
                ],
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Deletar sessão de Quiz",
      description: "Deleta uma sessão de quiz pelo ID.",
      tags: ["Quiz"],
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
                    example: "Quiz deletado com sucesso!",
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

  "/api/quiz/steps/{stepId}/generate": {
    post: {
      summary: "Gerar pergunta de um step",
      description: "Gera uma pergunta de quiz via IA para o step especificado.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "stepId",
          in: "path",
          schema: { type: "string" },
          required: true,
        },
      ],
      responses: {
        "201": {
          description: "Pergunta gerada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: { type: "string", example: "Gerado com sucesso" },
                  data: {
                    type: "object",
                    properties: {
                      stepId: { type: "string" },
                      question: { type: "object" },
                    },
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },

  "/api/quiz/steps/{stepId}/answer": {
    post: {
      summary: "Responder pergunta de um step",
      description:
        "Registra a resposta do usuário em um step e retorna o próximo step ou finaliza a sessão.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "stepId",
          in: "path",
          schema: { type: "string" },
          required: true,
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { optionId: { type: "string" } },
              required: ["optionId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Resposta registrada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "object",
                    properties: {
                      isCorrect: { type: "boolean" },
                      nextStep: { type: "object", nullable: true },
                    },
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },

  "/api/quiz/reset": {
    post: {
      summary: "Resetar sessão de Quiz",
      description:
        "Reseta todos os steps e perguntas de uma sessão de quiz, reiniciando a sessão.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { sessionId: { type: "string" } },
              required: ["sessionId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Sessão resetada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Sessão resetada com sucesso",
                  },
                  data: { type: "object" },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },

  "/api/quiz/abandon": {
    post: {
      summary: "Abandonar sessão de Quiz",
      description: "Marca a sessão como ABANDONED.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { sessionId: { type: "string" } },
              required: ["sessionId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Sessão abandonada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number" },
                  message: { type: "string", nullable: true },
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

  "/api/quiz/{id}": {
    get: {
      summary: "Obter sessão de Quiz por ID",
      description:
        "Retorna detalhes completos de uma sessão de quiz, incluindo steps e perguntas.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", schema: { type: "string" }, required: true },
      ],
      responses: {
        "200": {
          description: "Sessão retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number" },
                  message: { type: "string", nullable: true },
                  data: { type: "object" },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Deletar sessão de Quiz por ID",
      description: "Deleta uma sessão de quiz pelo ID.",
      tags: ["Quiz"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", schema: { type: "string" }, required: true },
      ],
      responses: {
        "200": {
          description: "Sessão deletada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number" },
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
