"use client";

import { useSession } from "@/features/session/api/use-session";
import { User } from "@prisma/client";
import { CardPicture } from "./_components/card-picture";
import { CardDetails } from "./_components/card-details";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { DetailsStatistics } from "./_components/details-statistics";
import { DeleteAccountButton } from "./_components/delete-account-button";

const mockUserStats = {
  id: "stat_001",
  userId: "user_001",
  flashcardsCreated: 120,
  decksCount: 5,
  studiesCompleted: 34,
  accuracyRate: 82.3,
  lastStudyAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000),
  studyStreak: 7,
  mostStudiedCategories: ["Inglês", "Biologia"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function ProfilePage() {
  const { user, isError, isLoading, isRefetching, refetch } = useSession();
  const { theme } = useTheme();

  const userData: User = {
    id: user?.id,
    email: user?.email,
    name: user?.name,
    image: user?.image,
    favColor: user?.favColor,
    surname: user?.surname,
    bio: user?.bio,
  } as User;

  if (isLoading) {
    return (
      <div className="xl:mx-20 space-y-4 lg:space-y-10">
        <div>
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold">
            Perfil
          </h1>
          <p>Veja todos os detalhes do seu perfil aqui</p>
        </div>

        <div className="w-full h-px border-border shrink-0 border border-dashed" />

        <div className="flex-1 flex max-sm:flex-col md:flex-row gap-4 md:gap-10">
          <Skeleton className="lg:w-2xl rounded-3xl min-h-96" />

          <Skeleton className="lg:min-w-6xl rounded-3xl min-h-96" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-[768px] overflow-hidden flex flex-col gap-y-10 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h4 className="text-2xl">Houve um erro, tente novamente!</h4>
          <Button type="button" size={"lg"} onClick={() => refetch()}>
            Recarregar{" "}
            <LoaderCircle className={cn(isRefetching && "animate-spin")} />
          </Button>
        </div>

        <Image
          src={`/server-error-${theme}.svg`}
          alt="server error image"
          width={400}
          height={400}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="xl:mx-20 space-y-4 lg:space-y-10">
      <div>
        <h1 className="text-3xl md:text-5xl xl:text-6xl font-semibold">
          Perfil
        </h1>
        <p>Veja todos os detalhes do seu perfil aqui</p>
      </div>

      <div className="w-full h-px border-border shrink-0 border border-dashed" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <CardPicture user={userData} />
        </div>
        <div className="md:col-span-2">
          <CardDetails user={userData} />
        </div>
        <div className="md:col-span-3">
          <DetailsStatistics mock={mockUserStats} />
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-3xl text-destructive">Perigo</h4>
        <div className="w-full h-px border-border shrink-0 border border-dashed" />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
