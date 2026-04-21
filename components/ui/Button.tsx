"use client";
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";
const variants: Record<Variant, string> = {
  primary:
    "bg-navy text-white border border-gold hover:bg-slate hover:shadow-cardHover hover:-translate-y-0.5",
  secondary:
    "bg-transparent text-navy border border-navy/20 hover:border-gold hover:text-slate hover:-translate-y-0.5",
  ghost: "bg-transparent text-navy hover:text-slate",
  dark:
    "bg-gold text-navy hover:bg-gold-hi border border-gold hover:-translate-y-0.5",
};
const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string; external?: boolean };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props as any;
  const classes = cn(base, variants[variant as Variant], sizes[size as Size], className);
  if ("href" in props && props.href) {
    if (props.external || /^https?:/.test(props.href)) {
      return (
        <a className={classes} href={props.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={props.href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...(rest as any)}>
      {children}
    </button>
  );
}
