import { getHero } from "@/lib/content";
import { PageHeader, Card } from "@/components/admin/AdminUI";
import { HeroEditor } from "./HeroEditor";

export const dynamic = "force-dynamic";

export default async function HeroPage() {
  const hero = await getHero();
  return (
    <>
      <PageHeader
        title="Hero"
        subtitle="The first thing visitors see on the homepage."
      />
      <HeroEditor
        initial={{
          eyebrow: hero.eyebrow ?? "",
          h1: hero.h1 ?? "",
          subheadline: hero.subheadline ?? "",
          body: hero.body ?? "",
          primary_cta_label: hero.primary_cta_label ?? "",
          primary_cta_url: hero.primary_cta_url ?? "",
          secondary_cta_label: hero.secondary_cta_label ?? "",
          secondary_cta_url: hero.secondary_cta_url ?? "",
          headshot_url: hero.headshot_url ?? "",
          words: (hero.words ?? []).map((w: any) => w.word as string),
          stats: (hero.stats ?? []).map((s: any) => ({ number: s.number, label: s.label })),
        }}
      />
    </>
  );
}
