import Image from "next/image";

export const EmptyState = ({
  message = "Continue usando a plataforma para exibirmos seus dados.",
}: {
  message?: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 max-w-md mx-auto text-center my-24">
      <Image
        src="/undraw_no-data.svg"
        alt="No data"
        width={160}
        height={160}
        className="mb-4 object-contain"
      />

      <p className="w-full">{message}</p>
    </div>
  );
};
