import { User } from "@prisma/client";
import Image from "next/image";
import { AvatarsButton } from "./avatars-button";

import { useDeleteImage } from "@/features/profile/api/use-delete-image";
import { useEditProfile } from "@/features/profile/api/use-edit-profile";
import { getCloudinaryPublicId } from "@/lib/utils";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

export const CardPicture = ({ user }: { user: User }) => {
  const { mutate: mutateEditProfile } = useEditProfile();
  const { mutate: mutateDeleteImageProfile } = useDeleteImage();

  async function handleUpload(result: any) {
    if (result.event !== "success") return;

    const oldPublicId = user.image?.includes("https://res.cloudinary.com")
      ? getCloudinaryPublicId(user.image)
      : null;

    mutateEditProfile(
      {
        image: result.info.secure_url,
      },
      {
        onSuccess: () => {
          if (oldPublicId) {
            mutateDeleteImageProfile({ publicId: oldPublicId });
          }
        },
      }
    );
  }

  return (
    <div className="bg-card border shadow rounded-3xl flex items-center justify-center flex-col gap-y-6 relative p-10">
      <div className="text-center">
        <h3 className="text-4xl capitalize md:text-4xl xl:text-4xl leading-none">
          {user?.name}
        </h3>
        {user?.surname && (
          <p className="text-xl text-primary leading-none">{user.surname}</p>
        )}
      </div>

      <div className="relative size-40 xl:size-64">
        <Image
          src={user.image ?? "/avatars/undraw_chill-guy-avatar_tqsm.svg"}
          fill
          className="object-cover object-center rounded-full"
          alt={user?.name ?? "user"}
        />
      </div>

      <div className="flex flex-row items-center justify-center gap-x-2">
        <CldUploadWidget
          uploadPreset="neura-preset"
          onSuccess={handleUpload}
          options={{
            sources: ["local"],
            multiple: false,
            cropping: true,
            showAdvancedOptions: false,
            showUploadMoreButton: false,
            language: "pt",
          }}
        >
          {({ open }) => (
            <Button size={"lg"} onClick={() => open?.()} className="relative">
              Foto
            </Button>
          )}
        </CldUploadWidget>

        <AvatarsButton
          currentAvatar={user?.name ?? ""}
          onEditProfile={mutateEditProfile}
          onDeleteImage={mutateDeleteImageProfile}
        />
      </div>
    </div>
  );
};
