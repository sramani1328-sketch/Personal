import { PageHeader } from "@/components/admin/AdminUI";
import { ExperienceEditor } from "../ExperienceEditor";

export const dynamic = "force-dynamic";

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader title="New role" subtitle="Add a role to your experience timeline." />
      <ExperienceEditor
        initial={{
          id: null,
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          isPresent: false,
          location: "",
          logoUrl: "",
          impact: "",
          bullets: [""],
        }}
      />
    </>
  );
}
