"use client";

import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  }

  return (
    <Button
      onClick={handleSignOut}
      variant={"ghost"}
      className="text-muted-foreground hover:text-foreground duration-200 transition-colors cursor-pointer group"
    >
      Sair <LogOut className="lg:group-hover:block lg:hidden" />
    </Button>
  );
};
