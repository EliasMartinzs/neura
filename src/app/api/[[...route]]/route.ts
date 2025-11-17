import { auth } from "@/lib/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";

export type AppVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const app = new Hono<{
  Variables: AppVariables;
}>().basePath("/api");

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

import deck from "./deck";
import flashcard from "./flashcard";
import profile from "./profile";
import session from "./session";
import study from "./study";

const route = app
  .route("/session", session)
  .route("/profile", profile)
  .route("/deck", deck)
  .route("/flashcard", flashcard)
  .route("/study", study);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
