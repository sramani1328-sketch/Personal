"use client";
import { useState, useTransition } from "react";
import { saveSkillsBlock } from "@/lib/admin/actions";
import { Card, GoldButton } from "@/components/admin/AdminUI";
import { Repeater } from "@/components/admin/Repeater";
import { FormFeedback } from "@/components/admin/SaveBar";
import { cn } from "@/lib/utils";
import { Save } from "lucide-react";

type Skill = { name: string; category: string };
type Cert = { name: string; issuingBody: string; year: string; description: string };
type Edu = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
};

export function SkillsEditor({
  initialSkills,
  initialCerts,
  initialEdu,
}: {
  initialSkills: Skill[];
  initialCerts: Cert[];
  initialEdu: Edu[];
}) {
  const [tab, setTab] = useState<"skills" | "certs" | "education">("skills");
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [certs, setCerts] = useState<Cert[]>(initialCerts);
  const [edu, setEdu] = useState<Edu[]>(initialEdu);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    const fd = new FormData();
    fd.set("kind", tab);
    fd.set("items", JSON.stringify(tab === "skills" ? skills : tab === "certs" ? certs : edu));
    start(async () => {
      try {
        await saveSkillsBlock(fd);
        setMsg("Saved.");
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  const tabs: { key: typeof tab; label: string; count: number }[] = [
    { key: "skills", label: "Skills", count: skills.length },
    { key: "certs", label: "Certifications", count: certs.length },
    { key: "education", label: "Education", count: edu.length },
  ];

  return (
    <>
      <div className="flex gap-2 border-b border-white/10 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors",
              tab === t.key
                ? "border-gold text-white"
                : "border-transparent text-white/60 hover:text-white",
            )}
          >
            {t.label}{" "}
            <span className="text-white/40 text-xs ml-1">({t.count})</span>
          </button>
        ))}
      </div>

      <Card>
        {tab === "skills" && (
          <Repeater
            initial={skills}
            onChange={(next) => setSkills(next as Skill[])}
            emptyItem={{ name: "", category: "Financial" }}
            addLabel="Add skill"
            fields={[
              { key: "name", label: "Skill", span: 8, placeholder: "Financial Modeling" },
              {
                key: "category",
                label: "Category",
                span: 4,
                placeholder: "Financial / Technical / Soft Skills",
              },
            ]}
          />
        )}
        {tab === "certs" && (
          <Repeater
            initial={certs}
            onChange={(next) => setCerts(next as Cert[])}
            emptyItem={{ name: "", issuingBody: "", year: "", description: "" }}
            addLabel="Add certification"
            fields={[
              { key: "name", label: "Name", span: 6 },
              { key: "issuingBody", label: "Issuer", span: 4 },
              { key: "year", label: "Year", span: 2 },
              { key: "description", label: "Description", span: 12, type: "textarea" },
            ]}
          />
        )}
        {tab === "education" && (
          <Repeater
            initial={edu}
            onChange={(next) => setEdu(next as Edu[])}
            emptyItem={{
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
              location: "",
              description: "",
            }}
            addLabel="Add education"
            fields={[
              { key: "institution", label: "Institution", span: 6 },
              { key: "degree", label: "Degree", span: 6 },
              { key: "field", label: "Field", span: 6 },
              { key: "location", label: "Location", span: 6 },
              { key: "startDate", label: "Start Date", span: 6, placeholder: "Sep 2024" },
              { key: "endDate", label: "End Date", span: 6, placeholder: "Aug 2025" },
              { key: "description", label: "Description", span: 12, type: "textarea" },
            ]}
          />
        )}
      </Card>

      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 mt-8 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-end gap-3">
        <GoldButton onClick={save} disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : `Save ${tab}`}
        </GoldButton>
      </div>
    </>
  );
}
