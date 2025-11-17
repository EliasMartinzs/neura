"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type MotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 active:scale-[0.97]",
        outline:
          "border bg-transparent hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50 active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.97]",
        link: "text-foreground hover:text-muted-foreground underline-offset-4 hover:underline",
        icon: "bg-background/20 backdrop-blur-md rounded-xl transition-colors duration-300 hover:scale-110 group/btn border border-white/30",
        gradient:
          "bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 hover:scale-110",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        full: "h-10 w-full rounded-md px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4 text-lg",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  MotionProps &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      whileHover = { scale: 1.03 },
      whileTap = { scale: 0.96 },
      transition = { duration: 0.15 },
      ...props
    },
    ref
  ) => {
    const MotionButton = motion.button;

    if (asChild) {
      const {
        whileHover: _wh,
        whileTap: _wt,
        initial: _init,
        animate: _anim,
        exit: _exit,
        variants: _vars,
        transition: _trans,
        ...restProps
      } = props as any;

      const Comp = Slot;
      return (
        <Comp
          ref={ref as any}
          className={cn(buttonVariants({ variant, size, className }))}
          {...restProps}
        />
      );
    }

    return (
      <MotionButton
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        whileHover={whileHover}
        whileTap={whileTap}
        transition={transition}
        {...(props as MotionProps & React.ComponentProps<"button">)}
      />
    );
  }
);

Button.displayName = "Button";
export { Button, buttonVariants };
