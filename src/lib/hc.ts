import type { AppType } from "@/app/api/[[...route]]/route";
import { hc } from "hono/client";

const client = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL as string, {
  init: {
    credentials: "include",
  },
});

export default client;
