"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  Navigation,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  FileText,
  FileDown,
  Mail,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Monogram } from "@/components/ui/Monogram";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
  { href: "/admin/nav", label: "Navigation", icon: Navigation },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/about", label: "About", icon: User },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills & Certs", icon: GraduationCap },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/resume", label: "Resume", icon: FileDown },
  { href: "/admin/messages", label: "Messages", icon: Mail, badge: "unread" },
  { href: "/admin/account", label: "Account", icon: User },
];

export function Sidebar({ email, unread }: { email: string; unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-40 h-10 w-10 inline-flex items-center justify-center rounded-md bg-navy border border-white/10"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-[#0A1324] border-r border-white/5 flex flex-col transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="px-5 py-5 flex items-center gap-3 border-b border-white/5">
          <Monogram />
          <div className="leading-tight">
            <div className="text-sm font-semibold">Shoaib Ramani</div>
            <div className="text-[11px] text-white/50">Admin Console</div>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {items.map((it) => {
            const Icon = it.icon;
            const active = pathname.startsWith(it.href);
            const showBadge = it.badge === "unread" && unread > 0;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-3 px-5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-white/5 text-white border-l-2 border-gold"
                    : "text-white/70 hover:text-white hover:bg-white/5",
                )}
                onClick={() => setOpen(false)}
              >
                <Icon size={16} />
                <span className="flex-1">{it.label}</span>
                {showBadge ? (
                  <span className="inline-flex items-center justify-center min-w-[22px] h-5 rounded-full bg-gold text-navy text-[11px] font-bold px-1.5">
                    {unread}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/5 text-xs text-white/50">
          <div className="truncate">{email}</div>
          <button
            onClick={logout}
            className="mt-3 inline-flex items-center gap-2 text-white/70 hover:text-gold"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="w-64 shrink-0 hidden lg:block" />
    </>
  );
}
