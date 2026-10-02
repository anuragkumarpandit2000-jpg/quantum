"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90",
        cool: "border border-b-2 border-cyan-950/40 bg-gradient-to-t from-sky-500 to-sky-400 shadow-md shadow-sky-500/20 ring-1 ring-inset ring-white/25 transition-[filter] duration-200 hover:brightness-110 active:brightness-90 text-slate-950 font-semibold",
        outline: "border border-slate-700 bg-slate-900/60 hover:bg-slate-800 hover:text-sky-300 text-slate-200 backdrop-blur-sm",
        secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700",
        ghost: "hover:bg-slate-800/60 hover:text-sky-400 text-slate-300",
        link: "text-primary underline-offset-4 hover:underline",
        quantum: "bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600 text-slate-950 font-bold tracking-wider hover:brightness-110 shadow-lg shadow-sky-500/30 border border-sky-300/30",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const liquidbuttonVariants = cva(
  "inline-flex items-center transition-colors justify-center cursor-pointer gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-sky-400",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:scale-105 duration-300 transition text-sky-400 font-semibold",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-sky-500/30 bg-slate-950/80 hover:bg-slate-900 text-sky-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 text-xs gap-1.5 px-4",
        lg: "h-12 rounded-full px-7 text-sm",
        xl: "h-14 rounded-full px-9 text-base",
        xxl: "h-16 rounded-full px-10 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "xl",
    },
  }
);

function GlassFilter() {
  return (
    <svg className="hidden">
      <defs>
        <filter
          id="container-glass"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05 0.05"
            numOctaves="1"
            seed="1"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

function LiquidButton({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof liquidbuttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <>
      <Comp
        data-slot="button"
        className={cn(
          "relative isolate overflow-hidden border border-sky-400/20 backdrop-blur-md",
          liquidbuttonVariants({ variant, size, className })
        )}
        {...props}
      >
        <div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2),inset_3px_3px_0.5px_-3.5px_rgba(56,189,248,0.25),inset_-3px_-3px_0.5px_-3.5px_rgba(56,189,248,0.4),inset_0_0_12px_rgba(56,189,248,0.15)] transition-all" />
        <div
          className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-full bg-slate-950/70"
          style={{ backdropFilter: 'url("#container-glass")' }}
        />
        <div className="pointer-events-none z-10 flex items-center justify-center gap-2">
          {children}
        </div>
        <GlassFilter />
      </Comp>
    </>
  );
}

type ColorVariant = "default" | "primary" | "success" | "error" | "gold" | "bronze";

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant;
}

const colorVariants: Record<
  ColorVariant,
  {
    outer: string;
    inner: string;
    button: string;
    textColor: string;
    textShadow: string;
  }
> = {
  default: {
    outer: "bg-gradient-to-b from-[#000] to-[#555]",
    inner: "bg-gradient-to-b from-[#333] via-[#111] to-[#222]",
    button: "bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(0_0_0_/_80%)]",
  },
  primary: {
    outer: "bg-gradient-to-b from-sky-400 to-sky-800",
    inner: "bg-gradient-to-b from-sky-950 via-slate-900 to-sky-900",
    button: "bg-gradient-to-b from-sky-600 to-sky-900",
    textColor: "text-white",
    textShadow: "[text-shadow:_0_-1px_0_rgb(2_6_23_/_90%)]",
  },
  success: {
    outer: "bg-gradient-to-b from-[#005A43] to-[#7CCB9B]",
    inner: "bg-gradient-to-b from-[#E5F8F0] via-[#00352F] to-[#D1F0E6]",
    button: "bg-gradient-to-b from-[#9ADBC8] to-[#3E8F7C]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(6_78_59_/_100%)]",
  },
  error: {
    outer: "bg-gradient-to-b from-[#5A0000] to-[#FFAEB0]",
    inner: "bg-gradient-to-b from-[#FFDEDE] via-[#680002] to-[#FFE9E9]",
    button: "bg-gradient-to-b from-[#F08D8F] to-[#A45253]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(146_64_14_/_100%)]",
  },
  gold: {
    outer: "bg-gradient-to-b from-[#917100] to-[#EAD98F]",
    inner: "bg-gradient-to-b from-[#FFFDDD] via-[#856807] to-[#FFF1B3]",
    button: "bg-gradient-to-b from-[#FFEBA1] to-[#9B873F]",
    textColor: "text-[#1e1302]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(255_255_255_/_40%)]",
  },
  bronze: {
    outer: "bg-gradient-to-b from-[#864813] to-[#E9B486]",
    inner: "bg-gradient-to-b from-[#EDC5A1] via-[#5F2D01] to-[#FFDEC1]",
    button: "bg-gradient-to-b from-[#FFE3C9] to-[#A36F3D]",
    textColor: "text-[#FFF7F0]",
    textShadow: "[text-shadow:_0_-1px_0_rgb(124_45_18_/_100%)]",
  },
};

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ children, className, variant = "primary", ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);
    const colors = colorVariants[variant];

    return (
      <div
        className={cn(
          "relative inline-flex transform-gpu rounded-lg p-[1.5px] transition-all duration-200",
          colors.outer,
          isHovered ? "shadow-lg shadow-sky-500/20" : ""
        )}
      >
        <div className={cn("absolute inset-[1px] rounded-md", colors.inner)} />
        <button
          ref={ref}
          className={cn(
            "relative z-10 m-[1px] inline-flex h-12 transform-gpu cursor-pointer items-center justify-center overflow-hidden rounded-md px-8 py-2 text-sm font-bold tracking-wide outline-none transition-transform duration-150",
            colors.button,
            colors.textColor,
            colors.textShadow,
            isPressed ? "scale-95" : "scale-100",
            className
          )}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsPressed(false);
          }}
          {...props}
        >
          {children}
        </button>
      </div>
    );
  }
);
MetalButton.displayName = "MetalButton";

export { Button, buttonVariants, liquidbuttonVariants, LiquidButton };
