"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";

import { SignInForm, signInSchema } from "@/schemas/sign-in.schema";
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
import { PasswordInput } from "@/components/ui/password-input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      {
        ...data,
        callbackURL: "/dashboard",
      },
      {
        onError: (error) => {
          if (error.error.status === 403) {
            router.push(`/auth/verify-email/${encodeURIComponent(data.email)}`);
          } else {
            toast.error(
              error.error.message || "Houve um erro, tente novamente!",
            );
          }
        },
      },
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.9,
        scale: { type: "keyframes", visualDuration: 0.4, bounce: 0.5 },
      }}
      className="min-w-sm md:min-w-md p-6 md:p-10 rounded-lg dark:shadow bg-card text-card-foreground space-y-6"
    >
      <div className="w-full flex flex-col items-center justify-center gap-y-6">
        <Diamond className="size-6 text-muted-foreground" />

        <span className="text-lg font-medium">Cadastrar-se em Neura</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="w-full flex items-center justify-between">
                  <span>Senha</span>
                  <Link
                    href="/auth/request-password-reset"
                    className="text-xs hover:underline"
                  >
                    Esqueçeu sua senha?
                  </Link>
                </FormLabel>
                <FormControl>
                  <PasswordInput {...field} placeholder="*****" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex items-center gap-x-3">
                <FormControl>
                  <Checkbox
                    defaultChecked={false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Mantenha-me conectado</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="full">
            {form.formState.isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </Form>

      <Link
        href="/auth/sign-up"
        className="text-center text-muted-foreground hover:text-foreground transition-colors duration-200 group"
      >
        Não tem uma conta?{" "}
        <span className="font-medium group-hover:underline">Crie uma</span>
      </Link>
    </motion.section>
  );
}
