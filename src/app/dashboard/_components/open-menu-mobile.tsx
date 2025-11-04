"use client";

import { DropdownUser } from "@/components/shared/dropwown-user";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { SignOutButton } from "@/components/shared/sign-out-button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { linksHeader } from "@/constants/links-header";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Diamond } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export const OpenMenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <ChevronDown
          strokeWidth={0.8}
          size={30}
          className={cn(
            "transition-transform duration-200 ease-in-out",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </DrawerTrigger>
      <DrawerContent className="space-y-6">
        <DrawerHeader className="py-8">
          <DrawerTitle className="flex items-center flex-col gap-y-2 justify-center text-muted-foreground">
            <Diamond />
            Neura
          </DrawerTitle>
        </DrawerHeader>

        <ul className="flex flex-col items-center justify-center gap-6 overflow-y-auto">
          {linksHeader.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-x-2 text-muted-foreground hover:text-foreground transition-colors duration-200 text-xl cursor-pointer",
                    cn(pathname === item.href && "text-foreground")
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon strokeWidth={0.8} size={36} /> {item.name}
                </Link>
              </li>
            );
          })}
          <SignOutButton />

          <ModeToggle />

          <DropdownUser closeDrawerMobile={() => setIsOpen(false)} />
        </ul>
      </DrawerContent>
    </Drawer>
  );
};
