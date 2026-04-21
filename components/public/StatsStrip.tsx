import { Counter } from "@/components/ui/Counter";
import { Reveal } from "@/components/ui/Reveal";

export function StatsStrip({ stats }: { stats: { number: string; label: string }[] }) {
  if (!stats.length) return null;
  return (
    <section className="bg-navy text-white">
      <div className="container-page py-16 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="text-center md:text-left">
              <div className="font-display text-4xl md:text-5xl font-bold text-gold">
                <Counter value={s.number} />
              </div>
              <div className="mt-1 text-sm text-white/70">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
