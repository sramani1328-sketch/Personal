import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAbout } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;
export const metadata = { title: "About" };

export default async function AboutPage() {
  const { about, philo, facts } = await getAbout();

  return (
    <div className="container-page py-12 md:py-24">
      <Reveal>
        <p className="font-display italic text-gold text-xl sm:text-2xl md:text-3xl max-w-3xl leading-snug">
          “{about.pull_quote || "Where does real value get built?"}”
        </p>
      </Reveal>

      <div className="mt-10 md:mt-16 grid lg:grid-cols-[1.4fr_1fr] gap-8 md:gap-12 items-start">
        <Reveal>
          <h2 className="font-display text-h1 text-navy">The story</h2>
          <div
            className="mt-5 md:mt-6 prose-sr max-w-2xl"
            dangerouslySetInnerHTML={{ __html: about.bio_html ?? "" }}
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="relative aspect-[4/5] w-full max-w-[360px] mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-navy shadow-card">
            {about.headshot_url ? (
              <Image src={about.headshot_url} alt="Shoaib Ramani" fill className="object-cover" sizes="(max-width: 1024px) 90vw, 340px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gold font-display text-6xl">
                SR
              </div>
            )}
          </div>
        </Reveal>
      </div>

      <section className="mt-16 md:mt-24">
        <div className="text-center"><span className="gold-rule">Philosophy</span></div>
        <div className="mt-8 md:mt-10 grid md:grid-cols-3 gap-5 md:gap-6">
          {philo.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <div className="rounded-xl bg-white border border-border p-7 h-full">
                <h3 className="font-display text-xl font-semibold text-navy leading-snug">{p.headline}</h3>
                <p className="mt-3 text-muted text-sm leading-relaxed">{p.subtitle}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 md:mt-24 max-w-3xl">
        <span className="gold-rule">Beyond the spreadsheets</span>
        <div className="mt-5 text-lead text-slate prose-sr [&_p]:my-2" dangerouslySetInnerHTML={{ __html: about.personal_touch || "" }} />
      </section>

      <section className="mt-16 md:mt-24">
        <div className="text-center"><span className="gold-rule">At a Glance</span></div>
        <div className="mt-8 max-w-3xl mx-auto rounded-xl bg-white border border-border overflow-hidden">
          {facts.map((f, i) => (
            <div
              key={f.id}
              className={`grid grid-cols-1 md:grid-cols-[200px_1fr] gap-1 md:gap-6 px-5 md:px-6 py-4 ${
                i > 0 ? "border-t border-border" : ""
              }`}
            >
              <div className="text-xs uppercase tracking-widest text-gold font-semibold">{f.key}</div>
              <div className="text-slate text-sm md:text-base break-words">{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 text-center">
        <Link
          href="/experience"
          className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold"
        >
          See My Full Experience <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
