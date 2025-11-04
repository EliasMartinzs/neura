"use client";

import { Separator } from "@/components/shared/separator";
import { User } from "@prisma/client";

import { Loader2, PencilLine, PencilOff } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  EditProfileForm,
  editProfileSchema,
} from "@/schemas/edit-profile.schema";
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
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useEditProfile } from "@/features/profile/api/use-edit-profile";

export const CardDetails = ({ user }: { user: User }) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: user?.bio || "",
      favColor: user?.favColor || "",
      name: user?.name,
      surname: user?.surname || "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        surname: user.surname || "",
        bio: user.bio || "",
        favColor: user.favColor || "",
      });
    }
  }, [user, form]);

  const { mutate, isPending } = useEditProfile();

  async function handleEditProfile(data: EditProfileForm) {
    mutate(data, {
      onSuccess: () => {
        setIsEditing(false);
        form.reset();
      },
    });
  }

  return (
    <div className="rounded-3xl border p-6 shadow space-y-4 bg-card h-fit">
      <div className="w-full flex items-center justify-between">
        <h4 className="text-2xl">Bio e Outros detalhes</h4>

        <Button
          variant={"ghost"}
          type="button"
          onClick={() => {
            form.reset();
            setIsEditing((prev) => !prev);
          }}
        >
          {isEditing ? (
            <PencilOff strokeWidth={0.8} className="size-6 cursor-pointer" />
          ) : (
            <PencilLine strokeWidth={0.8} className="size-6 cursor-pointer" />
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <FormEdit
              form={form}
              handleEditProfile={handleEditProfile}
              isPending={isPending}
            />
          </motion.div>
        ) : (
          <Details user={user} />
        )}
      </AnimatePresence>
    </div>
  );
};

const FormEdit = ({
  form,
  handleEditProfile,
  isPending,
}: {
  form: UseFormReturn<EditProfileForm>;
  handleEditProfile: (data: EditProfileForm) => Promise<void>;
  isPending: boolean;
}) => {
  const {
    formState: { isDirty, isSubmitting },
  } = form;

  const isLoading = isSubmitting || isPending;

  return (
    <Form {...form}>
      <div className="space-y-10">
        <div className="space-y-2 text-center">
          <div className="text-lg text-center space-y-2 text-muted-foreground font-extralight">
            <h5>Você está no modo de edição.</h5>
            Faça as alterações desejadas e salve quando terminar.
          </div>
        </div>

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            duration: 0.8,
          }}
        >
          <form
            onSubmit={form.handleSubmit(handleEditProfile)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-6 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lg">
                      Meu Nome
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-dashed"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lg">
                      Apelido
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-dashed"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="favColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lg">
                      Cor Favorita
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-dashed"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground text-lg">
                      Minha Biografia
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        value={field.value}
                        onChange={(e) => field.onChange(e)}
                        className="border-dashed"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="w-full flex justify-end">
              {isDirty && (
                <motion.button
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  type="submit"
                  disabled={isLoading}
                  className={buttonVariants({ size: "lg" })}
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Salvar"
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </Form>
  );
};

const Details = ({ user }: { user: User }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20">
      <div className="text-lg leading-6 capitalize self-start">
        <p className="text-muted-foreground">Meu nome</p>
        <p>{user?.name ?? "Nenhum"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize self-start">
        <p className="text-muted-foreground">Apelido</p>
        <p>{user?.surname ?? "Nenhum"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 self-start">
        <p className="text-muted-foreground">Cor favorita</p>
        <p>{user?.favColor ?? "Nenhuma"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 self-start">
        <p className="text-muted-foreground">E-Mail</p>
        <p>{user?.email ?? "Nenhum"}</p>

        <Separator />
      </div>

      <div className="text-lg leading-6 capitalize self-start">
        <p className="text-muted-foreground">Minha biografia</p>
        <p className="leading-5 line-clamp-1 hover:line-clamp-none transition-all duration-300 ease-in-out">
          {user?.bio}
        </p>

        <Separator />
      </div>
    </div>
  );
};
