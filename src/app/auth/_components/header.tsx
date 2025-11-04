import { Button } from "@/components/ui/button";
import { Diamond } from "lucide-react";
import Link from "next/link";

export const Header = () => {
  return (
    <header className="w-full p-4 md:p-6 fixed top-0 left-0 z-50">
      <Button variant="link" asChild>
        <Link href="/" className="text-lg">
          <Diamond className="size-6" /> <span>Neura</span>
        </Link>
      </Button>
    </header>
  );
};
