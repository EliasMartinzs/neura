"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";

import { Diamond, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

import z from "zod";
import { toast } from "sonner";
import { useState } from "react";

const emailSchema = z.object({
  email: z.string().email({ message: "Digite um email válido" }),
});

type EmailForm = z.infer<typeof emailSchema>;

export default function RequestPasswordReset() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const form = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleForgotPassword(value: EmailForm) {
    const { data, error } = await authClient.requestPasswordReset(
      {
        email: value.email,
        redirectTo: "/auth/reset-password",
      },
      {
        onSuccess: () => {
          setSentEmail(value.email);
          toast.success("E-Mail enviado com sucesso!");
          form.reset();
        },
        onError(context) {},
      }
    );

    if (error?.message) {
      toast.error(error.message);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.9,
        scale: { type: "keyframes", visualDuration: 0.4, bounce: 0.5 },
      }}
      className="min-w-sm md:min-w-md p-6 md:p-10 rounded-lg dark:shadow space-y-6"
    >
      {sentEmail ? (
        <div className="max-w-sm space-y-6">
          <h2 className="font-light text-muted-foreground">
            Enviamos um email para:{" "}
            <span className="text-foreground">{sentEmail}</span>
          </h2>

          <p className="text-muted-foreground font-extralight text-sm">
            Verifique sua caixa de entrada e siga as instruções para redefinir
            sua senha. Se não encontrar o email, confira a pasta de spam.
          </p>

          <button
            className="group text-xs text-muted-foreground hover:text-foreground duration-200 transition-colors"
            onClick={() => setSentEmail(null)}
          >
            Deseja alterar o E-mail?{" "}
            <span className="group-hover:underline">Click aqui</span>
          </button>
        </div>
      ) : (
        <div className="m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] shadow-md shadow-zinc-950/5">
          <div className="-m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
            <div>
              <Link href="/" aria-label="go home">
                <Diamond />
              </Link>
              <h1 className="mb-1 mt-4 text-xl font-semibold">
                Recuperar senha
              </h1>
              <p className="text-sm text-muted-foreground">
                Digite seu e-mail para receber um link de redefinição
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleForgotPassword)}
                className="space-y-6 mt-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Enviar link de redefinição"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Enviaremos um link para você redefinir sua senha.
              </p>
            </div>
          </div>

          <div className="p-3">
            <p className="text-accent-foreground text-center text-sm">
              Lembrou da sua senha?
              <Button asChild variant="link" className="px-2">
                <Link href="/auth/sign-in">Entre</Link>
              </Button>
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
