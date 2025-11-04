import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { sendEmail } from "./mailer";
import { verifyEmailTemplate } from "./templates/verify-email";
import { nextCookies } from "better-auth/next-js";
import { resetPasswordTemplate } from "./templates/reset-password-template";

export const auth = betterAuth({
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const emailTemplate = resetPasswordTemplate(user.name, url);

      await sendEmail({
        to: user.email,
        subject: "Resetar minha senha",
        html: emailTemplate,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const emailTemplate = verifyEmailTemplate(user.name, url);

      await sendEmail({
        to: user.email,
        subject: "Verifique seu e-mail",
        html: emailTemplate,
      });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [nextCookies()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
