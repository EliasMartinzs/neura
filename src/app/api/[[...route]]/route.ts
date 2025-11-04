import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";

import session from "./session";
import profile from "./profile";
import deck from "./deck";

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
app.on(["POST", "GET"], "/auth/*", async (c) => {
  try {
    return await auth.handler(c.req.raw);
  } catch (err) {
    console.error("Better Auth Error:", err);
    return c.json({ error: "Internal Server Error" }, 500);
  }
});
const route = app
  .route("/session", session)
  .route("/profile", profile)
  .route("/deck", deck);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type AppType = typeof route;
