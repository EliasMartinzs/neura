"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import {
  ResetPassowordForm,
  resetPasswordSchema,
} from "@/schemas/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Diamond, Link, Loader2 } from "lucide-react";
import * as motion from "motion/react-client";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense, use } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const router = useRouter();
  const params = use(searchParams);
  const token = params.token;
  const error = params.error;

  const form = useForm<ResetPassowordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleResetPassword(data: ResetPassowordForm) {
    if (token === null) return;

    await authClient.resetPassword(
      {
        newPassword: data.password,
        token,
      },
      {
        onError: (error) => {
          if (error.error.code === "INVALID_TOKEN") {
            toast.error("Token invalido, tente novamente", {});
            setTimeout(() => {
              router.push("/auth/request-password-reset");
            }, 1000);
          } else {
            toast.error(error.error.message || "Failed to reset password");
          }
        },
        onSuccess: () => {
          toast.success("Password reset successful", {
            description: "Redirection to login...",
          });
          setTimeout(() => {
            router.push("/auth/sign-in");
          }, 1000);
        },
      }
    );
  }

  if (token == null || error != null) {
    return (
      <Suspense fallback={<></>}>
        <div className="my-6 px-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Link para reset invalido</CardTitle>
              <CardDescription>
                O link para resetar expirou, tente novamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/auth/sign-in">Volte para login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<></>}>
      <motion.section
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.9,
          scale: { type: "keyframes", visualDuration: 0.4, bounce: 0.5 },
        }}
        className="min-w-sm md:min-w-md p-6 md:p-10 rounded-lg dark:shadow border dark:border-none space-y-6"
      >
        <div className="space-y-2">
          <span className="flex items-center gap-x-2">
            <Diamond className="size-5" /> Neura
          </span>

          <h4>Insira sua nova senha</h4>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      placeholder="********"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                "Resetar senha"
              )}
            </Button>
          </form>
        </Form>
      </motion.section>
    </Suspense>
  );
}
