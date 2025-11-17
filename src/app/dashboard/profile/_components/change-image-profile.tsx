import { User } from "@prisma/client";
import { AvatarsButton } from "./avatars-button";

import { useDeleteImage } from "@/features/profile/api/use-delete-image";
import { useEditProfile } from "@/features/profile/api/use-edit-profile";
import { getCloudinaryPublicId } from "@/lib/utils";
import { CldUploadWidget } from "next-cloudinary";

import { ImagePlus } from "lucide-react";

export const ChangeImageProfile = ({ user }: { user: User }) => {
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
          <button
            onClick={() => open?.()}
            className="mt-6 px-8 py-3 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 inline-flex items-center gap-2"
          >
            <ImagePlus className="w-4 h-4" />
            Nova foto
          </button>
        )}
      </CldUploadWidget>

      <AvatarsButton
        currentAvatar={user?.name ?? ""}
        onEditProfile={mutateEditProfile}
        onDeleteImage={mutateDeleteImageProfile}
      />
    </div>
  );
};
