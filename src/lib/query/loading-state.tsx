import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="fixed inset-0 right-0 -z-50 flex items-center justify-center">
      <Loader2 className="animate-spin size-7 text-muted-foreground" />
    </div>
  );
}
