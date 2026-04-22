import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

type Exp = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isPresent: boolean;
  impact: string;
};

export function ExperienceSnapshot({ items }: { items: Exp[] }) {
  const featured = items.slice(0, 3);
  return (
    <section className="bg-bg">
      <div className="container-page py-14 md:py-28">
        <div className="text-center mb-12">
          <span className="gold-rule">Where I've Built</span>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((e, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className="h-full rounded-xl bg-white border border-border p-7 hover:shadow-cardHover hover:-translate-y-1 transition-all">
                <p className="text-[11px] uppercase tracking-widest text-gold font-semibold">
                  {e.startDate} {e.isPresent ? "— Present" : e.endDate ? `— ${e.endDate}` : ""}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-navy">{e.company}</h3>
                <p className="text-slate text-sm italic">{e.role}</p>
                <div
                  className="prose prose-sm max-w-none mt-3 text-muted text-sm leading-relaxed [&_p]:my-1 [&_ul]:my-1 [&_strong]:text-navy"
                  dangerouslySetInnerHTML={{ __html: e.impact || "" }}
                />
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold"
          >
            View Full Experience <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
