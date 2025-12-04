// docs/profile.docs.ts
import { OpenAPIV3_1 } from "openapi-types";

export const profileDocs: Record<string, OpenAPIV3_1.PathItemObject> = {
  "api/profile": {
    put: {
      summary: "Editar perfil do usuário",
      description:
        "Atualiza os dados do usuário logado, como nome, bio, sobrenome e cor favorita.",
      tags: ["Profile"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string", example: "Elias" },
                surname: { type: "string", nullable: true, example: "Martins" },
                bio: {
                  type: "string",
                  nullable: true,
                  example: "Estudante de React Native",
                },
                favColor: {
                  type: "string",
                  nullable: true,
                  example: "#ff0000",
                },
              },
              required: ["name"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Perfil editado com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Perfil editado com sucesso!",
                  },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "400": {
          description: "Dados inválidos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 400 },
                  message: {
                    type: "string",
                    example: "Campo obrigatório ausente ou inválido.",
                  },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
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

  "api/profile/image": {
    delete: {
      summary: "Deletar imagem do usuário",
      description:
        "Deleta uma imagem do usuário a partir do `publicId` do Cloudinary.",
      tags: ["Profile"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                publicId: { type: "string", example: "profile_image_123" },
              },
              required: ["publicId"],
            },
          },
        },
      },
      responses: {
        "200": {
          description: "Imagem deletada com sucesso",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 200 },
                  message: {
                    type: "string",
                    example: "Imagem deletada com sucesso!",
                  },
                  data: { type: "object", nullable: true },
                },
                required: ["code", "message", "data"],
              },
            },
          },
        },
        "500": {
          description: "Erro ao deletar imagem",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  code: { type: "number", example: 500 },
                  message: {
                    type: "string",
                    example: "Erro ao deletar imagem.",
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
