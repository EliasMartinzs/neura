"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/features/session/api/use-session";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, User2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import UserImage from "../../../public/avatars/undraw_chill-guy-avatar_tqsm.svg";
import { useRouter } from "next/navigation";

interface Props {
  closeDrawerMobile?: () => void;
}

export const DropdownUser = ({ closeDrawerMobile }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, isLoading } = useSession();

  if (isLoading) {
    return <Loader2 className="animate-spin size-5 text-muted-foreground" />;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild className="w-auto border">
        <button className="flex items-center justify-between gap-x-4 bg-card max-sm:p-4 p-2 rounded-full">
          <Image
            src={user?.image || UserImage}
            alt={user?.name || "user"}
            width={36}
            height={36}
            className="size-9 object-center object-cover rounded-full "
          />

          <span className="text-sm">{user?.name}</span>
          <ChevronDown
            strokeWidth={0.8}
            size={30}
            className={cn(
              "transition-transform duration-200 ease-in-out",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              closeDrawerMobile;
              setIsOpen(false);
            }}
          >
            Meu Perfil <User2 />
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
