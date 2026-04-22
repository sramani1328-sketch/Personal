"use client";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TypingCycle } from "@/components/ui/TypingCycle";
import { ArrowRight, Download } from "lucide-react";

type Props = {
  eyebrow: string;
  h1: string;
  subheadline: string;
  body: string;
  primary: { label: string; url: string };
  secondary: { label: string; url: string };
  words: string[];
  stats: { number: string; label: string }[];
  headshot?: string;
};

export function Hero({ eyebrow, h1, subheadline, body, primary, secondary, words, stats, headshot }: Props) {
  return (
    <section className="relative overflow-hidden bg-bg">
      {/* geometric mesh */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          background:
            "radial-gradient(1200px 600px at 10% -10%, rgba(27,42,74,0.14), transparent 60%), radial-gradient(800px 500px at 90% 110%, rgba(201,168,76,0.16), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #1B2A4A 1px, transparent 1px), linear-gradient(to bottom, #1B2A4A 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative container-page pt-10 sm:pt-16 md:pt-24 pb-14 md:pb-20 md:min-h-[100vh] grid lg:grid-cols-[1.2fr_1fr] gap-10 md:gap-12 items-center">
        <div>
          <p className="gold-rule mb-5 md:mb-6">{eyebrow}</p>
          <h1 className="font-display text-hero text-navy">{h1}</h1>
          <h2 className="mt-3 md:mt-4 text-h2 text-slate font-display">{subheadline}</h2>
          <div
            className="mt-5 md:mt-6 max-w-xl text-lead text-muted prose-hero [&_p]:my-2 [&_a]:text-gold [&_a]:underline [&_a]:underline-offset-2 [&_strong]:text-navy [&_strong]:font-semibold"
            dangerouslySetInnerHTML={{ __html: body }}
          />
          <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
            <Button href={primary.url} size="lg">
              {primary.label} <ArrowRight size={18} />
            </Button>
            <Button href={secondary.url} variant="secondary" size="lg">
              <Download size={18} /> {secondary.label}
            </Button>
          </div>
          <div className="mt-6 md:mt-8">
            <TypingCycle words={words} />
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative mx-auto w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px]">
            <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-navy shadow-cardHover">
              {headshot ? (
                <Image src={headshot} alt="Shoaib Ramani" fill className="object-cover" priority sizes="(max-width: 1024px) 90vw, 340px" />
              ) : (
                <HeadshotPlaceholder />
              )}
              <div className="absolute inset-0 ring-1 ring-gold/40 rounded-2xl pointer-events-none" />
            </div>
            {/* floating stat cards — hidden on mobile, the StatsStrip below already displays them */}
            <div className="hidden sm:block">
              {stats.slice(0, 3).map((s, i) => (
                <div
                  key={i}
                  className={`absolute bg-navy text-white rounded-xl px-4 py-3 shadow-cardHover ring-1 ring-gold/40 animate-float-slow ${
                    i === 0 ? "-top-4 -left-6" : i === 1 ? "top-1/2 -right-8" : "-bottom-6 left-4"
                  }`}
                  style={{ animationDelay: `${i * 1.5}s` }}
                >
                  <div className="font-display text-xl font-bold text-gold leading-none">{s.number}</div>
                  <div className="mt-1 text-[11px] text-white/75 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeadshotPlaceholder() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 240 300" className="w-full h-full">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1B2A4A" />
            <stop offset="1" stopColor="#0D1B2A" />
          </linearGradient>
        </defs>
        <rect width="240" height="300" fill="url(#g)" />
        <circle cx="120" cy="120" r="46" fill="#C9A84C" opacity="0.88" />
        <rect x="60" y="180" width="120" height="140" rx="56" fill="#C9A84C" opacity="0.88" />
        <text x="50%" y="94%" textAnchor="middle" fill="#F8F9FB" fontSize="10" opacity="0.6">
          Upload headshot from Admin → Hero
        </text>
      </svg>
    </div>
  );
}
