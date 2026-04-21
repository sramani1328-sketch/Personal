import Link from "next/link";
import { Linkedin, Mail } from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";

export function Footer({
  items,
  tagline,
  linkedin,
  email,
}: {
  items: { label: string; url: string }[];
  tagline: string;
  linkedin: string;
  email: string;
}) {
  return (
    <footer className="bg-dark text-white/80 mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Monogram />
            <span className="font-display text-lg text-white">Shoaib Ramani</span>
          </div>
          <p className="mt-3 text-sm text-white/60 max-w-xs">{tagline}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">Navigate</p>
          <ul className="grid grid-cols-2 gap-y-2 text-sm">
            {items.map((it) => (
              <li key={it.url}>
                <Link href={it.url} className="hover:text-gold transition-colors">
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-gold mb-3">Connect</p>
          <div className="flex gap-3">
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 hover:border-gold hover:text-gold transition"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 text-xs text-white/50 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Shoaib Ramani. All rights reserved.</span>
          <Link href="/admin/login" className="hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
