import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, { error: "A senha deve ter pelo menos 8 caracteres" }),
});

type DeleteAccountForm = z.infer<typeof deleteAccountSchema>;

export function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleDeleteAccount(data: DeleteAccountForm) {
    await authClient.deleteUser(
      {
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          if (ctx.error.code === "INVALID_PASSWORD") {
            form.setError("password", {
              message: "Senha invalida!",
            });
          }
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="px-6 py-3 bg-red-500/30 border-2 border-red-500/50 rounded-xl text-red-300 font-semibold hover:bg-red-500/40 hover:border-red-500 transition-all">
          Excluir Minha Conta
        </button>
      </DialogTrigger>
      <DialogContent className="space-y-3">
        <DialogHeader>
          <DialogTitle>
            Tem certeza de que deseja excluir sua conta?
          </DialogTitle>
          <DialogDescription>
            Essa ação é irreversível — todos os seus dados, histórico e
            informações pessoais serão apagados permanentemente e não poderão
            ser recuperados.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleDeleteAccount)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Digite sua senha para deletar sua conta.
                  </FormLabel>
                  <FormControl>
                    <PasswordInput {...field} placeholder="*******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 bg-slate-500/30 border border-slate-500/50 rounded-xl text-slate-300 font-semibold hover:bg-slate-500/40 hover:border-slate-500 transition-all"
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-red-500/30 border border-red-500/50 rounded-xl text-red-300 font-semibold hover:bg-red-500/40 hover:border-red-500 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
