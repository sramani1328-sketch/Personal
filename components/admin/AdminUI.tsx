"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 pb-6 mb-6 border-b border-white/10">
      <div>
        <h1 className="font-display text-2xl text-white">{title}</h1>
        {subtitle ? <p className="text-sm text-white/60 mt-1">{subtitle}</p> : null}
      </div>
      {right ? <div>{right}</div> : null}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl bg-white/5 border border-white/10 p-6", className)}>
      {children}
    </div>
  );
}

export const inputCls =
  "mt-1 block w-full h-10 rounded-md bg-white/5 border border-white/15 px-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold";
export const textAreaCls =
  "mt-1 block w-full rounded-md bg-white/5 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold resize-y";
export const labelCls = "text-[11px] uppercase tracking-widest text-gold font-semibold";

export function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <input
        className={inputCls}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

export function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <textarea
        className={textAreaCls}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
      />
    </label>
  );
}

export function GoldButton({
  children,
  type = "button",
  onClick,
  disabled,
  className,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-5 rounded-md bg-gold text-navy font-semibold text-sm hover:bg-gold-hi disabled:opacity-60 transition",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  type = "button",
  onClick,
  className,
}: {
  children: React.ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-gold text-sm transition",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-5 right-5 z-50 bg-gold text-navy px-4 py-2 rounded-md text-sm font-semibold shadow-cardHover">
      {msg}
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  function show(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(null), 2200);
  }
  return { msg, show };
}
