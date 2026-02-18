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
import { PasswordInput } from "@/components/ui/password-input";
import { SignUpForm, signUpSchema } from "@/schemas/sign-up.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSignUp(data: SignUpForm) {
    await authClient.signUp.email(
      {
        ...data,
        callbackURL: "/auth/sign-in",
      },
      {
        onError: (error) => {
          toast.error(
            error.error.message || "Erro ao se cadrastar, tente novamente!",
          );
        },
        onSuccess: () => {
          toast.success("Por favor verifique seu E-Mail!");
          router.push("/auth/sign-in");
        },
      },
    );
  }

  return (
    <motion.div
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

        <span className="text-lg font-medium">Entre em Neura</span>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Jon doe"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    {...field}
                    disabled={isSubmitting}
                  />
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
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="*****"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="full" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Criar uma conta"
            )}
          </Button>
        </form>
      </Form>

      <Link
        href="/auth/sign-in"
        className="text-center text-muted-foreground hover:text-foreground transition-colors duration-200 group"
      >
        Já uma conta?{" "}
        <span className="font-medium group-hover:underline">
          Criar uma conta
        </span>
      </Link>
    </motion.div>
  );
}
