"use client";
import { Diamond, LogOut, Menu, PanelRight } from "lucide-react";
import Link from "next/link";
import { OpenMenuMobile } from "./open-menu-mobile";
import { linksHeader } from "@/constants/links-header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/shared/sign-out-button";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { motion } from "framer-motion";
import { DropdownUser } from "@/components/shared/dropwown-user";

export default function Header() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{
        opacity: 0,
        y: -100,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
      }}
      className={cn("fixed top-0 left-0 z-50 w-full")}
    >
      <nav
        className={cn(
          "mx-auto max-sm:max-w-xs md:max-w-2xl xl:max-w-5xl mt-6 p-4 xl:p-2 border rounded-full shadow"
        )}
      >
        {/* Max XL */}
        <div className="flex items-center justify-between xl:hidden">
          <Link
            href="/dashboard"
            className="flex items-center gap-x-2 text-muted-foreground hover:text-foreground duration-200 transition-colors cursor-pointer"
          >
            <Diamond />
            Neura
          </Link>

          <OpenMenuMobile />
        </div>

        {/* MIN Xl */}
        <div className="hidden xl:flex w-full items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-x-2 text-muted-foreground hover:text-foreground duration-200 transition-colors cursor-pointer pl-6"
          >
            <Diamond />
            Neura
          </Link>

          <ul className="flex items-center gap-x-5">
            {linksHeader.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-x-2 text-muted-foreground hover:text-foreground duration-200 transition-colors cursor-pointer group",
                      pathname === item.href && "text-foreground"
                    )}
                  >
                    <Icon
                      strokeWidth={0.8}
                      size={24}
                      className={cn(
                        "hidden group-hover:block transition-transform duration-200"
                      )}
                    />

                    {item.name}
                  </Link>
                </li>
              );
            })}

            <SignOutButton />
            <ModeToggle />

            <DropdownUser />
          </ul>
        </div>
      </nav>
    </motion.header>
  );
}
