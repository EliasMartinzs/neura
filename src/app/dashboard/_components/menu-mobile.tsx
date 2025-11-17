import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { linksHeader } from "@/constants/links-header";
import { ArrowRight, Logs } from "lucide-react";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";

export const MenuMobile = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (prevState: boolean) => void;
}) => {
  const router = useRouter();

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
            {linksHeader.map(({ href, icon, id, label, items }) => {
              const Icon = icon;
              return (
                <div
                  key={id}
                  className="flex items-start gap-x-3 group transition-colors duration-200 ease-in cursor-pointer"
                  onClick={() => handleNavigation(href)}
                >
                  {Icon && (
                    <Icon
                      strokeWidth={1.5}
                      className="size-6 group-hover:text-primary/80 transition-colors duration-200 ease-in"
                    />
                  )}

                  {items ? (
                    items.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Collapsible
                          key={item.id}
                          defaultOpen={true}
                          className="flex items-start justify-start flex-col group"
                        >
                          <CollapsibleTrigger>{label}</CollapsibleTrigger>

                          <CollapsibleContent
                            asChild
                            className="text-muted-foreground my-2 border-l pl-1.5 transition-transform ease-in duration-200"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-x-3"
                            >
                              <Icon className="size-4" />
                              {item.label}
                              <ArrowRight className="size-4 hidden group-hover:block" />
                            </Link>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })
                  ) : (
                    <span className="group-hover:text-primary/80 font-extralight">
                      {label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
