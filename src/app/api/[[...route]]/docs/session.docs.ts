// docs/session.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const sessionDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/session": {
    get: {
      summary: "Obter usuário logado",
      description:
        "Retorna os dados do usuário logado incluindo decks e flashcards.",
      tags: ["Session"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Usuário retornado com sucesso",
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
                      user: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          name: { type: "string" },
                          email: { type: "string" },
                          decks: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                name: { type: "string" },
                                description: { type: "string", nullable: true },
                                color: { type: "string", nullable: true },
                              },
                            },
                          },
                          flashcards: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                id: { type: "string" },
                                front: { type: "string" },
                                back: { type: "string" },
                                difficulty: {
                                  type: "string",
                                  enum: [
                                    "VERY_EASY",
                                    "EASY",
                                    "MEDIUM",
                                    "HARD",
                                    "VERY_HARD",
                                  ],
                                  nullable: true,
                                },
                              },
                            },
                          },
                        },
                        nullable: true, // <- aqui garantimos compatibilidade
                      },
                    },
                    required: ["user"],
                  },
                },
                required: ["code", "data", "message"],
              },
            },
          },
        },
        "401": {
          description: "Usuário não autenticado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 401 },
                  message: { type: "string", example: "Unauthorized" },
                  data: { type: "object", nullable: true }, // <- aqui também
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
  },

  "/api/session/dashboard": {
    get: {
      summary: "Dashboard do usuário",
      description:
        "Retorna estatísticas do usuário, revisões do dia, atividades recentes e estudo diário.",
      tags: ["Session"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Dashboard retornado com sucesso",
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
                      stats: {
                        type: "object",
                        properties: {
                          decksCount: { type: "number" },
                          flashcardsCreated: { type: "number" },
                          studiesCompleted: { type: "number" },
                        },
                      },
                      cardsReviewToday: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            front: { type: "string" },
                            topic: { type: "string", nullable: true },
                            difficulty: { type: "string", nullable: true },
                            nextReview: {
                              type: "string",
                              format: "date-time",
                              nullable: true,
                            },
                          },
                        },
                      },
                      activities: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            type: { type: "string" },
                            message: { type: "string", nullable: true },
                            createdAt: { type: "string", format: "date-time" },
                          },
                        },
                      },
                      dailyStudy: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            date: { type: "string", format: "date" },
                            count: { type: "number" },
                          },
                        },
                      },
                    },
                  },
                },
                required: ["code", "data", "message"],
              },
            },
          },
        },
      },
    },
  },

  "/api/session/stats": {
    post: {
      summary: "Criar estatísticas do usuário",
      description:
        "Cria registros iniciais de estatísticas para o usuário logado.",
      tags: ["Session"],
      security: [{ bearerAuth: [] }],
      responses: {
        "201": {
          description: "Estatísticas criadas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
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
};
