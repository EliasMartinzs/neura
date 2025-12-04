// docs/study-session.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const studySessionDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/study-session/start": {
    post: {
      summary: "Iniciar sessão de estudo",
      description:
        "Cria uma nova sessão de estudo para o deck especificado ou retoma sessão ativa.",
      tags: ["StudySession"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { deckId: { type: "string" } },
              required: ["deckId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Sessão ativa retomada ou deck sem flashcards pendentes",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string" },
                  data: {
                    type: "object",
                    properties: {
                      sessionId: { type: "string" },
                      deckId: { type: "string" },
                    },
                    nullable: true,
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "201": {
          description: "Nova sessão criada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: { type: "string", example: "Nova sessão criada." },
                  data: {
                    type: "object",
                    properties: {
                      sessionId: { type: "string" },
                      deckId: { type: "string" },
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

  "/api/study-session/review": {
    post: {
      summary: "Revisar flashcard",
      description:
        "Registra a revisão de um flashcard em uma sessão de estudo.",
      tags: ["StudySession"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                flashcardId: { type: "string" },
                grade: { type: "number" },
                timeToAnswer: { type: "number" },
                notes: { type: "string", nullable: true },
                sessionId: { type: "string" },
              },
              required: ["flashcardId", "grade", "timeToAnswer", "sessionId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Revisão registrada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "404": {
          description: "Flashcard não encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
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

  "/api/study-session/end": {
    post: {
      summary: "Finalizar sessão de estudo",
      description:
        "Marca a sessão como concluída e atualiza estatísticas do usuário.",
      tags: ["StudySession"],
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
          description: "Sessão finalizada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", example: "Seção finalizada" },
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

  "/api/study-session/reviews": {
    get: {
      summary: "Listar revisões do usuário",
      description:
        "Retorna flashcards urgentes, de hoje, futuros e completados, além do total de flashcards.",
      tags: ["StudySession"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Revisões retornadas com sucesso",
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
                      urgent: { type: "array", items: { type: "object" } },
                      today: { type: "array", items: { type: "object" } },
                      upcoming: { type: "array", items: { type: "object" } },
                      completed: { type: "array", items: { type: "object" } },
                      totalFlashcards: { type: "number" },
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

  "/api/study-session/{id}": {
    get: {
      summary: "Obter sessão pelo ID",
      description: "Retorna uma sessão específica e seus flashcards.",
      tags: ["StudySession"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Sessão retornada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
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
  },

  "/api/study-session/summary/{id}": {
    get: {
      summary: "Resumo da sessão",
      description:
        "Retorna o resumo da sessão, incluindo progresso, contagem de acertos/erros, próximo card e taxa de acerto.",
      tags: ["StudySession"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Resumo da sessão retornado com sucesso",
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
                      sessionId: { type: "string" },
                      deckId: { type: "string" },
                      deckTitle: { type: "string" },
                      totalFlashcards: { type: "number" },
                      reviewedFlashcards: { type: "number" },
                      remainingFlashcards: { type: "number" },
                      progress: { type: "number" },
                      correctCount: { type: "number" },
                      wrongCount: { type: "number" },
                      nextCard: { type: "object", nullable: true },
                      completed: { type: "boolean" },
                      endedAt: {
                        type: "string",
                        format: "date-time",
                        nullable: true,
                      },
                      accuracy: { type: "string" },
                    },
                  },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "404": {
          description: "Sessão não encontrada",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  message: {
                    type: "string",
                    example: "Sessão não encontrada.",
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
};
