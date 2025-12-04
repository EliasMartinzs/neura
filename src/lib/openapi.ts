import { app } from "@/app/api/[[...route]]/route";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Meu App API",
        version: "1.0.0",
        description: "Descrição da API",
      },
      servers: [
        { url: "http://localhost:3000/api", description: "Servidor local" },
      ],
    },
    includeEmptyPaths: true, // opcional, para incluir mesmo rotas sem docs
  })
);
