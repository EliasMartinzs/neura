"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { avatars } from "@/constants/avatars";
import { ResponseImageDelete } from "@/features/profile/api/use-delete-image";
import {
  RequestEditProfile,
  ResponseEditProfile,
} from "@/features/profile/api/use-edit-profile";
import { cn, getCloudinaryPublicId } from "@/lib/utils";
import { UseMutateFunction } from "@tanstack/react-query";
import { UserRoundPen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  currentAvatar: string;
  onDeleteImage: UseMutateFunction<
    ResponseImageDelete,
    Error,
    { publicId: string },
    unknown
  >;
  onEditProfile: UseMutateFunction<
    ResponseEditProfile,
    Error,
    RequestEditProfile,
    unknown
  >;
}

export const AvatarsButton = ({
  currentAvatar,
  onDeleteImage,
  onEditProfile,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  async function handleEditImageProfile(avatar: string) {
    const oldPublicId = currentAvatar.includes("https://res.cloudinary.com")
      ? getCloudinaryPublicId(currentAvatar)
      : null;

    onEditProfile(
      {
        image: avatar,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          onDeleteImage({
            publicId: oldPublicId!,
          });
        },
        onError: ({ message }) => {
          toast.error(message);
        },
      }
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 px-8 py-3 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-2">
          <UserRoundPen className="w-4 h-4" />
          Novo avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-6">
        <DialogHeader>
          <DialogTitle>Escolha o avatar que combina com você!</DialogTitle>
          <DialogDescription>
            Escolha o avatar que mais combina com o seu humor — dá pra mudar
            sempre que quiser!
          </DialogDescription>
        </DialogHeader>

        <ul className="flex flex-wrap items-center justify-center gap-4">
          {avatars.map(({ avatar, id }) => (
            <li key={id} className="size-24 rounded-full relative">
              <Image
                src={avatar}
                alt="avatar"
                fill
                className={cn(
                  "object-cover object-center hover:scale-105 cursor-pointer hover:border rounded-full border-primary",
                  avatar === currentAvatar && "opacity-30 pointer-events-none"
                )}
                onClick={() => handleEditImageProfile(avatar)}
              />
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
