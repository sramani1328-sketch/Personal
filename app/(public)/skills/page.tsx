import { Award, GraduationCap } from "lucide-react";
import { getCerts, getEducation, getSkills } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;
export const metadata = { title: "Skills & Certifications" };

export default async function SkillsPage() {
  const [skills, certs, edu] = await Promise.all([getSkills(), getCerts(), getEducation()]);

  const byCat: Record<string, typeof skills> = {};
  for (const s of skills) (byCat[s.category] = byCat[s.category] || []).push(s);

  return (
    <div className="container-page py-12 md:py-24">
      <div className="text-center">
        <span className="gold-rule">Capabilities</span>
        <h1 className="mt-4 font-display text-h1 text-navy">Skills & Certifications</h1>
      </div>

      <section className="mt-14">
        <h2 className="font-display text-h2 text-navy mb-4">Core Skills</h2>
        <div className="space-y-6">
          {Object.entries(byCat).map(([cat, rows]) => (
            <Reveal key={cat}>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gold font-semibold mb-3">
                  {cat}
                </p>
                <div className="flex flex-wrap gap-2">
                  {rows.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center rounded-full border border-navy/15 bg-white px-3 py-1.5 text-sm text-slate hover:border-gold hover:text-navy transition-colors"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-h2 text-navy mb-6">Certifications</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((c, i) => (
            <Reveal key={c.id} delay={i * 60}>
              <div className="rounded-xl bg-white border border-border p-5 flex gap-4 hover:shadow-cardHover hover:-translate-y-0.5 transition-all h-full">
                <div className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-navy">{c.name}</h3>
                  <p className="text-xs text-muted mt-1">
                    {[c.issuingBody, c.year].filter(Boolean).join(" · ")}
                  </p>
                  {c.description ? (
                    <p className="text-sm text-slate mt-2">{c.description}</p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <h2 className="font-display text-h2 text-navy mb-6">Education</h2>
        <div className="space-y-4">
          {edu.map((e, i) => (
            <Reveal key={e.id} delay={i * 60}>
              <div className="rounded-xl bg-white border border-border p-6 flex gap-4">
                <div className="shrink-0 inline-flex h-11 w-11 items-center justify-center rounded-md bg-navy text-gold">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-navy">{e.institution}</h3>
                  <p className="text-slate text-sm">
                    {e.degree}
                    {e.field ? ` · ${e.field}` : ""}
                  </p>
                  <p className="text-xs text-muted mt-1">
                    {e.startDate} – {e.endDate}
                    {e.location ? ` · ${e.location}` : ""}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
