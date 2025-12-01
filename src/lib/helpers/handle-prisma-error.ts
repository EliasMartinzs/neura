import { AppVariables } from "@/app/api/[[...route]]/route";
import { Context } from "hono";

export function handlePrismaError(
  c: Context<{ Variables: AppVariables }>,
  error: any
) {
  console.error(error);

  const isDev = process.env.NODE_ENV === "development";

  if (error?.name === "PrismaClientValidationError") {
    return c.json(
      {
        code: 400,
        message: "Os dados enviados são inválidos.",
        ...(isDev && { details: error.message }),
        data: null,
      },
      400
    );
  }

  if (error?.name === "PrismaClientKnownRequestError") {
    switch (error.code) {
      case "P2002": // unique constraint
        return c.json(
          {
            code: 409,
            message: "Já existe um registro com esses dados.",
            data: null,
          },
          409
        );
      case "P2003": // foreign key
        return c.json(
          {
            code: 409,
            message: "Relacionamento inválido. Verifique os IDs relacionados.",
            data: null,
          },
          409
        );
      case "P2025": // not found
        return c.json(
          { code: 404, message: "Registro não encontrado.", data: null },
          404
        );
      default:
        return c.json(
          { code: 500, message: "Erro de banco de dados.", data: null },
          500
        );
    }
  }

  return c.json(
    {
      code: 500,
      message: "Ocorreu um erro inesperado.",
      ...(isDev && { details: error.message }),
      data: null,
    },
    500
  );
}
