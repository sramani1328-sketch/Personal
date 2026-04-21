import { db } from "@/lib/db/client";
import { navItems } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { NavEditor } from "./NavEditor";

export const dynamic = "force-dynamic";

export default async function NavPage() {
  const rows = await db.select().from(navItems).orderBy(asc(navItems.order)).catch(() => []);
  return (
    <>
      <PageHeader title="Navigation" subtitle="Header menu links shown on every public page." />
      <Card>
        <NavEditor initial={rows.map((r) => ({ label: r.label, url: r.url, visible: r.visible }))} />
      </Card>
    </>
  );
}
