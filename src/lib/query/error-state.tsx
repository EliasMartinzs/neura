import { Button } from "@/components/ui/button";
import Image from "next/image";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="fixed inset-0 right-0 -z-50 flex items-center justify-center flex-col gap-6">
      <Image
        src="/server-error-dark.svg"
        width={160}
        height={160}
        alt="server error"
        className="object-center object-cover"
      />
      <p className="">{message ?? "Ocorreu um erro inesperado."}</p>

      {onRetry && (
        <Button variant={"outline"} onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
