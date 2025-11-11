"use client";

import { DropdownUser } from "@/components/shared/dropwown-user";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { linksHeader } from "@/constants/links-header";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Diamond } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import OpenIcon from "../../../../public/icons/open.png";

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full max-w-sm mx-auto my-10 shadow p-4 rounded-full z-50">
      <nav className="w-full flex items-center relative">
        <Link href="/dashboard" className="flex items-center gap-x-3 group">
          <Diamond className="size-5 text-primary/70 hover:text-primary duration-200 ease-in transition-colors group-hover:scale-105" />
          Neura
        </Link>

        <Image
          src={OpenIcon}
          alt="open menu"
          className={cn(
            "size-6 object-cover duration-200 ease-in transition-transform absolute z-51 right-5",
            open ? "rotate-0" : "rotate-180"
          )}
          onClick={() => setOpen((open) => !open)}
        />
      </nav>

      {open && (
        <button
          className="fixed inset-0 z-50 cursor-pointer w-screen h-screen bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen((open) => !open)}
        ></button>
      )}

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { ease: ["easeIn", "easeOut"] },
            }}
            exit={{
              opacity: 0,
              scale: 0,
              transition: { ease: ["easeIn", "easeOut"] },
            }}
            key="modal"
            className="absolute top-0 left-1/2 right-1/2 -translate-x-1/2 transform w-screen overflow-hidden bg-background backdrop-blur-lg pt-32 p-10 flex flex-col items-center justify-center gap-6 shadow z-50"
          >
            <div className="flex items-center justify-evenly gap-4 flex-wrap">
              {linksHeader.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={
                      "flex items-center cursor-pointer gap-x-3 text-muted-foreground hover:text-primary transition-colors duration-200 ease-in group text-xl"
                    }
                    onClick={() => setOpen((open) => !open)}
                  >
                    <Icon className="group-hover:text-primary group-hover:scale-110 size-6" />{" "}
                    {link.name}
                  </Link>
                );
              })}

              <ModeToggle />
            </div>

            <DropdownUser />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
