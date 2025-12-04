// docs/flashcard.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const flashcardDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "/api/flashcard": {
    get: {
      summary: "Listar flashcards",
      description:
        "Lista flashcards do usuário logado, com filtro por deck, paginação e perPage.",
      tags: ["Flashcard"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "deck",
          in: "query",
          schema: { type: "string" },
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
          description: "Flashcards retornados com sucesso",
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
                        front: { type: "string" },
                        back: { type: "string" },
                        bloomLevel: { type: "string" },
                        difficulty: { type: "string" },
                        deck: { type: "object" },
                        reviews: { type: "array", items: { type: "object" } },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                        _count: {
                          type: "object",
                          properties: { reviews: { type: "number" } },
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
      summary: "Criar flashcard",
      description: "Cria um novo flashcard para o usuário logado.",
      tags: ["Flashcard"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                front: { type: "string" },
                back: { type: "string" },
                deckId: { type: "string" },
                difficulty: {
                  type: "string",
                  enum: ["EASY", "MEDIUM", "HARD"],
                },
                bloomLevel: {
                  type: "string",
                  enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
                },
              },
              required: ["front", "back", "deckId", "difficulty", "bloomLevel"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Flashcard criado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
                  message: {
                    type: "string",
                    example: "Flashcard criado com sucesso!",
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

  "/api/flashcard/generate": {
    post: {
      summary: "Gerar flashcards via AI",
      description:
        "Gera flashcards usando inteligência artificial para um deck específico.",
      tags: ["Flashcard"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                deckId: { type: "string" },
                topic: { type: "string" },
                amount: { type: "number" },
                prompt: { type: "string" },
                bloomLevel: { type: "string" },
              },
              required: ["deckId", "topic", "amount", "prompt", "bloomLevel"],
            },
          },
        },
      },
      responses: {
        "201": {
          description: "Flashcards gerados com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 201 },
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

  "/api/flashcard/{id}": {
    get: {
      summary: "Obter flashcard pelo ID",
      description: "Retorna um flashcard específico do usuário logado.",
      tags: ["Flashcard"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Flashcard retornado com sucesso",
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
    delete: {
      summary: "Deletar flashcard pelo ID",
      description:
        "Deleta um flashcard permanentemente e atualiza estatísticas do usuário.",
      tags: ["Flashcard"],
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: {
        "200": {
          description: "Flashcard deletado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Flashcard deletado com sucesso!",
                  },
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
                  message: {
                    type: "string",
                    example: "Registro não encontrado!",
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
