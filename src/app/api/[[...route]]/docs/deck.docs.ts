// docs/deck.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const deckDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/deck": {
    get: {
      summary: "Listar decks do usuário",
      description:
        "Lista todos os decks do usuário logado, com filtros de tags, paginação e perPage.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "tags",
          in: "query",
          schema: {
            oneOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
          required: false,
        },
        {
          name: "page",
          in: "query",
          schema: { type: "number", default: 1 },
          required: false,
        },
        {
          name: "perPage",
          in: "query",
          schema: { type: "number", default: 10 },
          required: false,
        },
      ],
      responses: {
        "200": {
          description: "Decks retornados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        color: { type: "string", nullable: true },
                        description: { type: "string", nullable: true },
                        tags: { type: "array", items: { type: "string" } },
                        createdAt: { type: "string", format: "date-time" },
                        difficulty: { type: "string" },
                        reviewCount: { type: "number" },
                        lastStudiedAt: {
                          type: "string",
                          format: "date-time",
                          nullable: true,
                        },
                        flashcards: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              front: { type: "string" },
                              reviews: {
                                type: "array",
                                items: { type: "object" },
                              },
                              performanceAvg: {
                                type: "number",
                                nullable: true,
                              },
                              nextReview: {
                                type: "string",
                                format: "date-time",
                                nullable: true,
                              },
                            },
                          },
                        },
                        _count: {
                          type: "object",
                          properties: {
                            flashcards: { type: "number" },
                          },
                        },
                      },
                    },
                  },
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
    post: {
      summary: "Criar novo deck",
      description: "Cria um novo deck para o usuário logado.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                color: { type: "string", nullable: true },
                description: { type: "string", nullable: true },
                tags: { type: "array", items: { type: "string" }, default: [] },
                difficulty: {
                  type: "string",
                  enum: ["EASY", "MEDIUM", "HARD"],
                },
              },
              required: ["name", "difficulty"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Deck criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: {
                    type: "string",
                    example: "Deck criado com sucesso",
                  },
                  data: { type: "string" },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Editar deck",
      description: "Atualiza os dados de um deck existente.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                color: { type: "string", nullable: true },
                description: { type: "string", nullable: true },
                tags: { type: "array", items: { type: "string" } },
                difficulty: {
                  type: "string",
                  enum: ["EASY", "MEDIUM", "HARD"],
                },
              },
              required: ["id", "name", "difficulty"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Deck editado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Deck editado com sucesso!",
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
    delete: {
      summary: "Deletar decks múltiplos",
      description: "Deleta vários decks do usuário logado.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                ids: { type: "array", items: { type: "string" }, default: [] },
              },
              required: ["ids"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Decks deletados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Todos os decks deletados com sucesso!",
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

  "/api/deck/tags": {
    get: {
      summary: "Listar todas as tags",
      description: "Retorna todas as tags dos decks do usuário logado.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Tags retornadas com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "array",
                    items: { type: "string" },
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

  "/api/deck/trash": {
    get: {
      summary: "Decks na lixeira",
      description: "Lista todos os decks deletados do usuário logado.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      responses: {
        "200": {
          description: "Decks na lixeira retornados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        color: { type: "string", nullable: true },
                        difficulty: { type: "string" },
                        deletedAt: { type: "string", format: "date-time" },
                      },
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

  "/api/deck/names": {
    get: {
      summary: "Listar nomes de decks",
      description: "Retorna apenas id, nome, cor e contagem de flashcards.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "hasFlashcard",
          in: "query",
          schema: { type: "boolean" },
          required: false,
        },
      ],
      responses: {
        "200": {
          description: "Nomes de decks retornados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: { type: "string", nullable: true },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        color: { type: "string", nullable: true },
                        difficulty: { type: "string" },
                        _count: {
                          type: "object",
                          properties: { flashcards: { type: "number" } },
                        },
                      },
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

  "/api/deck/{id}": {
    get: {
      summary: "Obter deck pelo ID",
      description:
        "Retorna um deck específico, incluindo flashcards, performance e sessões de estudo.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
        },
      ],
      responses: {
        "200": {
          description: "Deck retornado com sucesso",
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
        "404": {
          description: "Deck não encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  message: { type: "string", example: "Deck não encontrado" },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Deletar (soft) deck pelo ID",
      description: "Move um deck para a lixeira.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Deck movido para a lixeira",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Deck movido para a lixeira!",
                  },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "404": {
          description: "Deck não encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 404 },
                  message: {
                    type: "string",
                    example: "Registro não encontrado",
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
    delete: {
      summary: "Deletar deck pelo ID",
      description: "Deleta um deck permanentemente.",
      tags: ["Deck"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Deck deletado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Deck deletado com sucesso!",
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
