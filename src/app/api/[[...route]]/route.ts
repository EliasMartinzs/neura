import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { swaggerUI } from "@hono/swagger-ui";
export type AppVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

export const app = new Hono<{
  Variables: AppVariables;
}>({
  strict: false,
}).basePath("/api");

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://neura-kappa.vercel.app",
      "http://10.0.2.2:3000/api",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
    maxAge: 86400,
  })
);

// app.use("*", async (c, next) => {
//   console.log("HEADERS RECEBIDOS:", c.req.raw.headers);
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });
//   console.log("SESSION DO TOKEN:", session);
//   if (!session) {
//     c.set("user", null);
//     c.set("session", null);
//     await next();
//     return;
//   }

//   c.set("user", session.user);
//   c.set("session", session.session);
//   await next();
// });

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  // Session existe → preenche user e session
  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

import deck from "./controllers/deck";
import explainLearn from "./controllers/explain-learn";
import flashcard from "./controllers/flashcard";
import profile from "./controllers/profile";
import quiz from "./controllers/quiz";
import session from "./controllers/session";
import study from "./controllers/study";
import { openAPIRouteHandler } from "hono-openapi";
import { sessionDocs } from "./docs/session.docs";
import { profileDocs } from "./docs/profile.docs";
import { deckDocs } from "./docs/deck.docs";
import { flashcardDocs } from "./docs/flashcard.dock";
import { studySessionDocs } from "./docs/study.docs";
import { explainLearnDocs } from "./docs/explain-learn.docs";
import { quizDocs } from "./docs/quiz.docs";
import prisma from "@/lib/db";

const route = app
  .route("/session", session)
  .route("/profile", profile)
  .route("/deck", deck)
  .route("/flashcard", flashcard)
  .route("/study", study)
  .route("/explain-learn", explainLearn)
  .route("/quiz", quiz);

const allDocs = {
  ...sessionDocs,
  ...profileDocs,
  ...deckDocs,
  ...flashcardDocs,
  ...studySessionDocs,
  ...explainLearnDocs,
  ...quizDocs,
};

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: "Meu App API",
        version: "1.0.0",
        description: "Documentação completa do backend Hono + Next.js",
      },
      servers: [
        { url: "http://localhost:3000/api", description: "Servidor local" },
      ],
      paths: allDocs,
    },
    includeEmptyPaths: false,
  })
);

app.get("/docs/*", swaggerUI({ url: "/api/openapi.json" }));

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
