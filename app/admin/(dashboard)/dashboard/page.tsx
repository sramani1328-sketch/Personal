import Link from "next/link";
import { db } from "@/lib/db/client";
import { blogPosts, contactSubmissions } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { formatDate } from "@/lib/utils";
import { FileText, Mail, Clock, PlusCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [[{ postsCount }], [{ msgCount }], [{ unread }], recent] = await Promise.all([
    db.select({ postsCount: count() }).from(blogPosts).catch(() => [{ postsCount: 0 }]),
    db.select({ msgCount: count() }).from(contactSubmissions).catch(() => [{ msgCount: 0 }]),
    db
      .select({ unread: count() })
      .from(contactSubmissions)
      .where(eq(contactSubmissions.read, false))
      .catch(() => [{ unread: 0 }]),
    db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(5).catch(() => []),
  ] as any);

  const stats = [
    { label: "Blog posts", value: postsCount, icon: FileText },
    { label: "Messages", value: msgCount, icon: Mail },
    { label: "Unread", value: unread, icon: Mail },
    { label: "Last update", value: recent[0] ? formatDate(recent[0].createdAt) : "—", icon: Clock },
  ];

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Quick overview of your site." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-md bg-navy inline-flex items-center justify-center text-gold">
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-gold font-semibold">
                    {s.label}
                  </div>
                  <div className="font-display text-2xl">{String(s.value)}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6 mt-8">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Recent messages</h2>
            <Link href="/admin/messages" className="text-xs text-gold hover:text-gold-hi">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recent.length ? (
              recent.map((m: any) => (
                <Link
                  key={m.id}
                  href="/admin/messages"
                  className="flex items-center justify-between py-3 hover:bg-white/5 rounded px-2"
                >
                  <div>
                    <div className="text-sm flex items-center gap-2">
                      {!m.read && <span className="h-2 w-2 rounded-full bg-gold" />}
                      <span className="font-semibold">{m.name}</span>
                      <span className="text-white/40">· {m.subject}</span>
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">{m.email}</div>
                  </div>
                  <div className="text-xs text-white/40">{formatDate(m.createdAt)}</div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-white/50">No messages yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-lg mb-4">Quick actions</h2>
          <div className="flex flex-col gap-2">
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 rounded-md px-3 h-10 bg-navy hover:bg-slate text-sm"
            >
              <PlusCircle size={16} /> New blog post
            </Link>
            <Link
              href="/admin/hero"
              className="flex items-center gap-2 rounded-md px-3 h-10 bg-white/5 hover:bg-white/10 text-sm border border-white/10"
            >
              Edit hero
            </Link>
            <Link
              href="/admin/resume"
              className="flex items-center gap-2 rounded-md px-3 h-10 bg-white/5 hover:bg-white/10 text-sm border border-white/10"
            >
              Upload resume
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
