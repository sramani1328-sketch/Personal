import Link from "next/link";
import { getExperiences } from "@/lib/content";
import { PageHeader, Card, GoldButton } from "@/components/admin/AdminUI";
import { Plus, Pencil } from "lucide-react";
import { DeleteExperience } from "./DeleteExperience";

export const dynamic = "force-dynamic";

export default async function ExperienceListPage() {
  const rows = await getExperiences();
  return (
    <>
      <PageHeader
        title="Experience"
        subtitle="Roles shown on the homepage snapshot and the Experience timeline."
        right={
          <Link href="/admin/experience/new">
            <GoldButton>
              <Plus size={14} /> Add role
            </GoldButton>
          </Link>
        }
      />

      <Card>
        {rows.length === 0 ? (
          <p className="text-sm text-white/50">No experience entries yet. Add your first role.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {rows.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between py-4 gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold">{r.role}</div>
                  <div className="text-xs text-white/60">
                    {r.company} · {r.startDate} – {r.isPresent ? "Present" : r.endDate ?? "—"}
                    {r.location ? ` · ${r.location}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/experience/${r.id}`}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white text-sm"
                  >
                    <Pencil size={13} /> Edit
                  </Link>
                  <DeleteExperience id={r.id} label={r.role} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
