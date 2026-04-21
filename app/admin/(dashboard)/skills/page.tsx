import { getSkills, getCerts, getEducation } from "@/lib/content";
import { PageHeader } from "@/components/admin/AdminUI";
import { SkillsEditor } from "./SkillsEditor";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  const [skills, certs, edu] = await Promise.all([getSkills(), getCerts(), getEducation()]);
  return (
    <>
      <PageHeader
        title="Skills, Certifications & Education"
        subtitle="Everything on the Skills and Resume pages."
      />
      <SkillsEditor
        initialSkills={skills.map((s: any) => ({ name: s.name, category: s.category }))}
        initialCerts={certs.map((c: any) => ({
          name: c.name,
          issuingBody: c.issuingBody ?? "",
          year: c.year ?? "",
          description: c.description ?? "",
        }))}
        initialEdu={edu.map((e: any) => ({
          institution: e.institution,
          degree: e.degree,
          field: e.field ?? "",
          startDate: e.startDate,
          endDate: e.endDate,
          location: e.location ?? "",
          description: e.description ?? "",
        }))}
      />
    </>
  );
}
