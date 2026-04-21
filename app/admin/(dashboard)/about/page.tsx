import { getAbout, getServices } from "@/lib/content";
import { PageHeader } from "@/components/admin/AdminUI";
import { AboutEditor } from "./AboutEditor";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { about, philo, facts } = await getAbout();
  const services = await getServices();
  return (
    <>
      <PageHeader title="About & Services" subtitle="Bio, philosophy, quick facts, and homepage services." />
      <AboutEditor
        initial={{
          pull_quote: about.pull_quote ?? "",
          bio_html: about.bio_html ?? "",
          personal_touch: about.personal_touch ?? "",
          headshot_url: about.headshot_url ?? "",
          philo: philo.map((p: any) => ({ headline: p.headline, subtitle: p.subtitle ?? "" })),
          facts: facts.map((f: any) => ({ key: f.key, value: f.value })),
          services: services.map((s: any) => ({ icon: s.icon, title: s.title, body: s.body })),
        }}
      />
    </>
  );
}
