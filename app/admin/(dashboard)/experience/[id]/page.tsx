import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { experiences, experienceBullets } from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/AdminUI";
import { ExperienceEditor } from "../ExperienceEditor";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const [row] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (!row) notFound();
  const bullets = await db
    .select()
    .from(experienceBullets)
    .where(eq(experienceBullets.experienceId, id))
    .orderBy(asc(experienceBullets.order));
  return (
    <>
      <PageHeader title="Edit role" subtitle={`${row.role} · ${row.company}`} />
      <ExperienceEditor
        initial={{
          id: row.id,
          company: row.company,
          role: row.role,
          startDate: row.startDate,
          endDate: row.endDate ?? "",
          isPresent: row.isPresent,
          location: row.location ?? "",
          logoUrl: row.logoUrl ?? "",
          impact: row.impact ?? "",
          bullets: bullets.map((b) => b.text),
        }}
      />
    </>
  );
}
