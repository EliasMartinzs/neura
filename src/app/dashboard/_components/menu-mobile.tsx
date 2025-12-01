import { ModeToggle } from "@/components/shared/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { linksHeader } from "@/constants/links-header";
import { cn } from "@/lib/utils";
import { Logs } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

export const MenuMobile = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (prevState: boolean) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string | null) => {
    if (!href) return;

    setOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Logs className="size-5 text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in cursor-pointer max-lg:block hidden" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>

        <div className="flex-1 h-full flex items-center p-8">
          <div className="space-y-6">
            {linksHeader.map(({ href, icon, id, label }) => {
              const Icon = icon;
              return (
                <div
                  key={id}
                  className={cn(
                    "flex items-start gap-x-3 group transition-colors duration-200 ease-in cursor-pointer text-muted-foreground",
                    href === pathname && "text-foreground"
                  )}
                  onClick={() => handleNavigation(href)}
                >
                  {Icon && (
                    <Icon
                      strokeWidth={1.5}
                      className="size-6 group-hover:text-primary/80 transition-colors duration-200 ease-in"
                    />
                  )}

                  <>{label}</>
                </div>
              );
            })}

            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
