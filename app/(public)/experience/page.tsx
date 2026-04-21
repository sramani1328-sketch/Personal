import { getExperiences } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;
export const metadata = { title: "Experience" };

export default async function ExperiencePage() {
  const items = await getExperiences();

  return (
    <div className="container-page py-16 md:py-24">
      <div className="text-center">
        <span className="gold-rule">Career Timeline</span>
        <h1 className="mt-4 font-display text-h1 text-navy">Experience</h1>
        <p className="mt-3 text-muted max-w-xl mx-auto">
          From India to the US — M&A, FP&A, and strategic finance, built deal by deal.
        </p>
      </div>

      <div className="relative mt-16 max-w-5xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-navy/20 to-gold/0" />
        <ul className="space-y-12">
          {items.map((e, idx) => {
            const left = idx % 2 === 0;
            return (
              <li key={e.id} className="relative">
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-3 w-3 h-3 rounded-full bg-gold ring-4 ring-bg" />
                <Reveal>
                  <div
                    className={`pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 ${
                      left ? "" : "md:[direction:rtl]"
                    }`}
                  >
                    <div className={`md:[direction:ltr] ${left ? "md:pr-10 md:text-right" : "md:pl-10"}`}>
                      <p className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                        {e.startDate} {e.isPresent ? "— Present" : e.endDate ? `— ${e.endDate}` : ""}
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-bold text-navy">{e.company}</h3>
                      <p className="text-slate italic">{e.role}</p>
                      <p className="text-muted text-sm mt-1">{e.location}</p>
                    </div>
                    <div className={`mt-4 md:mt-0 md:[direction:ltr] ${left ? "md:pl-10" : "md:pr-10"}`}>
                      <ul className="space-y-2">
                        {e.bullets.map((b) => (
                          <li key={b.id} className="text-sm text-slate leading-relaxed flex gap-2">
                            <span className="text-gold mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            <span>{b.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
