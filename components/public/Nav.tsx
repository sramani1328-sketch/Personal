"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Linkedin } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils";

export function Nav({ items, linkedinUrl }: { items: { label: string; url: string }[]; linkedinUrl: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Floating Apple-notification-style nav */}
      <header className="fixed top-3 sm:top-4 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1.5 sm:gap-2",
            "rounded-full",
            "bg-navy/90 supports-[backdrop-filter]:bg-navy/70",
            "backdrop-blur-xl backdrop-saturate-150",
            "border border-white/10",
            "shadow-[0_8px_30px_rgb(0,0,0,0.25)]",
            "pl-2 pr-1 py-1",
            "transition-all duration-300 ease-out",
            scrolled ? "scale-[0.97]" : "scale-100",
          )}
        >
          {/* Brand pill */}
          <Link
            href="/"
            aria-label="Home"
            className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <Monogram />
            <span className="hidden sm:inline text-[13px] font-semibold tracking-tight text-white">
              Shoaib Ramani
            </span>
          </Link>

          {/* Divider */}
          <span className="hidden md:block w-px h-6 bg-white/10" />

          {/* Nav items */}
          <nav className="hidden md:flex items-center gap-0.5">
            {items.map((it) => {
              const active = pathname === it.url;
              return (
                <Link
                  key={it.url}
                  href={it.url}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-gold/15 text-gold"
                      : "text-white/75 hover:text-white hover:bg-white/5",
                  )}
                >
                  {it.label}
                  {active && (
                    <span className="absolute left-1/2 -bottom-0.5 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <Link
            href={linkedinUrl || "/contact"}
            {...(linkedinUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={cn(
              "hidden md:inline-flex items-center gap-1.5",
              "bg-gold text-navy",
              "px-3.5 py-1.5 rounded-full",
              "text-[13px] font-semibold",
              "shadow-[0_2px_10px_rgba(201,168,76,0.35)]",
              "hover:bg-[#d7b867] hover:shadow-[0_2px_14px_rgba(201,168,76,0.5)]",
              "transition-all duration-200",
            )}
          >
            <Linkedin size={14} />
            Let&apos;s Connect
          </Link>

          {/* Mobile toggle */}
          <button
            aria-label="Toggle menu"
            className="md:hidden ml-1 text-white p-2 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer — anchored under the pill */}
      <div
        className={cn(
          "md:hidden fixed top-16 left-3 right-3 z-40",
          "rounded-2xl bg-navy/95 supports-[backdrop-filter]:bg-navy/80 backdrop-blur-xl",
          "border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.35)]",
          "transition-all duration-300 origin-top",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        <div className="p-3 flex flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.url;
            return (
              <Link
                key={it.url}
                href={it.url}
                className={cn(
                  "px-4 py-3 rounded-xl text-[15px] font-medium transition-colors",
                  active ? "bg-gold/15 text-gold" : "text-white/85 hover:bg-white/5",
                )}
              >
                {it.label}
              </Link>
            );
          })}
          <Link
            href={linkedinUrl || "/contact"}
            {...(linkedinUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="mt-1 inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-4 py-3 rounded-xl"
          >
            <Linkedin size={16} /> Let&apos;s Connect
          </Link>
        </div>
      </div>

      {/* Spacer so page content doesn't go under the pill */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
