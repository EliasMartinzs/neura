import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

export type AppVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{
  Variables: AppVariables;
}>({
  strict: false,
}).basePath("/api");

app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "https://bandanaed-exemplarily-judi.ngrok-free.app",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
    maxAge: 86400,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    await next();
    return;
  }

  c.set("user", session.user);
  c.set("session", session.session);
  await next();
});

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

import deck from "./controllers/deck";
import flashcard from "./controllers/flashcard";
import profile from "./controllers/profile";
import session from "./controllers/session";
import study from "./controllers/study";
import explainLearn from "./controllers/explain-learn";
import quiz from "./controllers/quiz";

const route = app
  .route("/session", session)
  .route("/profile", profile)
  .route("/deck", deck)
  .route("/flashcard", flashcard)
  .route("/study", study)
  .route("/explain-learn", explainLearn)
  .route("/quiz", quiz);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
