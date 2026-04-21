import { Hero } from "@/components/public/Hero";
import { StatsStrip } from "@/components/public/StatsStrip";
import { ServiceCards } from "@/components/public/ServiceCards";
import { ExperienceSnapshot } from "@/components/public/ExperienceSnapshot";
import { BlogTeaser } from "@/components/public/BlogTeaser";
import { CTABanner } from "@/components/public/CTABanner";
import {
  getExperiences,
  getHero,
  getRecentPosts,
  getServices,
  kv,
} from "@/lib/content";
import { siteSettings } from "@/lib/db/schema";

export const revalidate = 60;

export default async function HomePage() {
  const [hero, services, exps, posts, settings] = await Promise.all([
    getHero(),
    getServices(),
    getExperiences(),
    getRecentPosts(3),
    kv(siteSettings),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Shoaib Ramani",
    jobTitle: "Corporate Development & Strategic Finance Analyst",
    worksFor: { "@type": "Organization", name: "FinAccurate LLC" },
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoaibramani.com",
    sameAs: [settings.linkedin].filter(Boolean),
    address: { "@type": "PostalAddress", addressLocality: "Woburn", addressRegion: "MA", addressCountry: "US" },
    email: settings.email,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero
        eyebrow={hero.eyebrow ?? ""}
        h1={hero.h1 ?? "Shoaib Ramani"}
        subheadline={hero.subheadline ?? ""}
        body={hero.body ?? ""}
        primary={{ label: hero.primary_cta_label ?? "View My Work", url: hero.primary_cta_url ?? "/experience" }}
        secondary={{
          label: hero.secondary_cta_label ?? "Download Resume",
          url: hero.secondary_cta_url ?? "/resume",
        }}
        words={hero.words.map((w: any) => w.word)}
        stats={hero.stats.map((s: any) => ({ number: s.number, label: s.label }))}
        headshot={hero.headshot_url || undefined}
      />
      <StatsStrip stats={hero.stats.map((s: any) => ({ number: s.number, label: s.label }))} />
      <ServiceCards items={services} />
      <ExperienceSnapshot items={exps as any} />
      <BlogTeaser posts={posts as any} />
      <CTABanner linkedin={settings.linkedin ?? ""} />
    </>
  );
}
