import { redirect } from "next/navigation";
import { getSessionAdmin } from "@/lib/auth/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getSessionAdmin();
  if (!admin) redirect("/admin/login");

  const [{ unread }] = (await db
    .select({ unread: count() })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.read, false))
    .catch(() => [{ unread: 0 as number }])) as [{ unread: number }];

  return (
    <div className="min-h-screen bg-[#0B1729] text-white/90 flex">
      <Sidebar email={admin.email} unread={Number(unread)} />
      <div className="flex-1 min-w-0">
        <div className="px-6 py-6 md:px-10 md:py-8">{children}</div>
      </div>
    </div>
  );
}
