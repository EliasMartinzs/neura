"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const params = useParams<{ email: string }>();
  const [cooldown, setCooldown] = useState(0);

  async function handleEmailVerification() {
    if (cooldown > 0) return;

    await authClient.sendVerificationEmail(
      {
        email: decodeURIComponent(params.email),
        callbackURL: "/dashboard",
      },
      {
        onError: (error) => {
          toast.error(error.error.message || "Houve um erro, tente novamente!");
        },
        onSuccess: () => {
          toast.success("E-mail de verificação enviado!");
          setCooldown(30);
        },
      }
    );
  }

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="space-y-10 max-w-sm m-auto text-center">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-medium">
          Olá {decodeURIComponent(params.email)},
        </h2>
        <p className="text-muted-foreground">
          Para começar a usar nossa plataforma, por favor verifique seu e-mail.
        </p>
      </div>
      <div className="space-y-4">
        <h3>
          Se você não recebeu o e-mail de verificação, clique no botão abaixo
          para reenviar:
        </h3>

        <Button
          variant={"outline"}
          size={"full"}
          type="button"
          onClick={handleEmailVerification}
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar e-mail"}
        </Button>
      </div>
    </div>
  );
}
