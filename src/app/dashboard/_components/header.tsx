"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";

import { useState } from "react";
import { MenuMobile } from "./menu-mobile";
import { linksHeader } from "@/constants/links-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { ModeToggle } from "@/components/shared/mode-toggle";

export const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="flex my-6 lg:my-10">
      <nav className="w-full flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-x-2 text-lg font-semibold group"
        >
          <Sparkles className="size-7 animate-pulse text-primary group-hover:scale-105 transition-transform duration-200" />
          <span className="group-hover:text-muted-foreground transition-colors duration-200 ease-in">
            Neura
          </span>
        </Link>

        <MenuMobile open={open} setOpen={setOpen} />

        <div className="max-lg:hidden">
          <div className="flex items-center gap-8 p-4">
            {linksHeader.map(({ href, icon, id, label }) => {
              const Icon = icon;
              return (
                <Link
                  href={href}
                  key={id}
                  className={cn(
                    "text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in flex items-center gap-x-3",
                    pathname === href ? "text-foreground" : null
                  )}
                >
                  {pathname === href && <Icon />} {label}
                </Link>
              );
            })}

            <SignOutButton />

            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};
