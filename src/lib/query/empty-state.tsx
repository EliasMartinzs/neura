import Image from "next/image";

export const EmptyState = () => {
  return (
    <div className="fixed inset-0 left-0 -z-50 flex items-center justify-center flex-col gap-6">
      <Image
        src="/undraw_no-data.svg"
        alt="no-data"
        width={160}
        height={160}
        className="object-center object-cover"
      />

      <p>Continue usando a plataforma para exibirmos seus dados</p>
    </div>
  );
};
