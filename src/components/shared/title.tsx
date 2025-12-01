"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Title = ({ children, action }: Props) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        ease: "easeIn",
        duration: 0.8,
      }}
      className={cn(action && "flex items-center justify-between")}
    >
      <h2 className="text-xl font-semibold lg:text-4xl">{children}</h2>

      {action && action}
    </motion.div>
  );
};
