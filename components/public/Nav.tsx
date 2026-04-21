"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Linkedin } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { Button } from "@/components/ui/Button";
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
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || open ? "bg-navy shadow-md" : "bg-transparent",
        )}
      >
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white" aria-label="Home">
            <Monogram />
            <span className={cn("hidden sm:inline text-sm font-semibold tracking-tight", scrolled || open ? "text-white" : "text-white")}>
              Shoaib Ramani
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {items.map((it) => {
              const active = pathname === it.url;
              return (
                <Link
                  key={it.url}
                  href={it.url}
                  className={cn(
                    "relative text-[13px] font-medium transition-colors",
                    scrolled ? "text-white/80 hover:text-white" : "text-white/85 hover:text-white",
                  )}
                >
                  {it.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 right-0 h-[2px] bg-gold transition-transform origin-left",
                      active ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="hidden md:block">
            <Button href={linkedinUrl || "/contact"} variant="dark" size="md" external={!!linkedinUrl}>
              <Linkedin size={16} /> Let's Connect
            </Button>
          </div>
          <button
            aria-label="Toggle menu"
            className="md:hidden text-white p-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {/* Mobile drawer */}
      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 bg-navy transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
      >
        <div className="container-page pt-24 pb-10 flex flex-col gap-6">
          {items.map((it) => (
            <Link
              key={it.url}
              href={it.url}
              className="text-white text-2xl font-display font-semibold"
            >
              {it.label}
            </Link>
          ))}
          <Button href={linkedinUrl || "/contact"} variant="dark" size="lg" external={!!linkedinUrl}>
            <Linkedin size={18} /> Let's Connect
          </Button>
        </div>
      </div>
      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
