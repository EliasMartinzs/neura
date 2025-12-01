import { Hono } from "hono";
import { AppVariables } from "../route";
import { zValidator } from "@hono/zod-validator";
import { editProfileSchema } from "@/schemas/edit-profile.schema";
import { heavyWriteSecurityMiddleware } from "@/middlewares/heavy-write";
import prisma from "@/lib/db";
import z from "zod";

import { v2 as cloudinary } from "cloudinary";
import { authMiddleware } from "@/middlewares/auth-middleware";
import { handlePrismaError } from "@/lib/helpers/handle-prisma-error";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const app = new Hono<{
  Variables: AppVariables;
}>()
  .put(
    "/",
    zValidator("form", editProfileSchema),
    authMiddleware,
    heavyWriteSecurityMiddleware,
    async (c) => {
      const user = c.get("user");
      const values = c.req.valid("form");

      try {
        await prisma.user.update({
          where: {
            id: user?.id,
          },
          data: {
            ...values,
          },
        });

        return c.json(
          {
            code: 200,
            message: "Perfil editado com sucesso!",
            data: null,
          },
          200
        );
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  )
  .delete(
    "/image",
    zValidator(
      "form",
      z.object({
        publicId: z.string(),
      })
    ),
    async (c) => {
      try {
        const { publicId } = c.req.valid("form");
        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
          return c.json({ message: "Erro ao deletar imagem." }, 500);
        }

        return c.json({ message: "Imagem deletada com sucesso!" }, 200);
      } catch (error) {
        return handlePrismaError(c, error);
      }
    }
  );

export default app;
