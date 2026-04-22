import { Handshake, LineChart, TrendingUp, LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const ICONS: Record<string, LucideIcon> = {
  handshake: Handshake,
  "line-chart": LineChart,
  "trending-up": TrendingUp,
};

export function ServiceCards({ items }: { items: { icon: string; title: string; body: string }[] }) {
  return (
    <section className="container-page py-14 md:py-28">
      <div className="text-center mb-8 md:mb-12">
        <span className="gold-rule">Where I Create Value</span>
      </div>
      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        {items.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Handshake;
          return (
            <Reveal key={i} delay={i * 100}>
              <div className="group h-full rounded-xl bg-white border border-border p-6 md:p-8 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-gold">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-navy">{s.title}</h3>
                <p className="mt-3 text-muted leading-relaxed text-sm">{s.body}</p>
                <div className="mt-6 h-px w-8 bg-gold transition-all group-hover:w-16" />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
