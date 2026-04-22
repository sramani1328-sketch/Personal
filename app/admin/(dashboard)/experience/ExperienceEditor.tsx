"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { upsertExperience } from "@/lib/admin/actions";
import { Card, Field, GoldButton, GhostButton } from "@/components/admin/AdminUI";
import { RichTextArea } from "@/components/admin/RichTextArea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { StringListRepeater } from "@/components/admin/Repeater";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Save, ArrowLeft } from "lucide-react";

type Init = {
  id: number | null;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  location: string;
  logoUrl: string;
  impact: string;
  bullets: string[];
};

export function ExperienceEditor({ initial }: { initial: Init }) {
  const router = useRouter();
  const [bullets, setBullets] = useState<string[]>(initial.bullets);
  const [isPresent, setIsPresent] = useState<boolean>(initial.isPresent);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (initial.id) fd.set("id", String(initial.id));
    fd.set("bullets", JSON.stringify(bullets.filter((b) => b.trim())));
    start(async () => {
      try {
        const id = await upsertExperience(fd);
        setMsg("Saved.");
        if (!initial.id && id) router.push(`/admin/experience/${id}`);
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="mb-2">
        <Link href="/admin/experience" className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold">
          <ArrowLeft size={14} /> All roles
        </Link>
      </div>

      <Card>
        <h2 className="font-display text-lg mb-4">Role</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Company" name="company" defaultValue={initial.company} required />
          <Field label="Role" name="role" defaultValue={initial.role} required />
          <Field label="Start Date" name="startDate" defaultValue={initial.startDate} placeholder="Apr 2026" required />
          <Field
            label="End Date"
            name="endDate"
            defaultValue={initial.endDate}
            placeholder="Aug 2025 (blank if present)"
          />
          <label className="flex items-center gap-2 text-sm text-white/80 md:col-span-2">
            <input
              type="checkbox"
              name="isPresent"
              checked={isPresent}
              onChange={(e) => setIsPresent(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <span>This is my current role (show "Present")</span>
          </label>
          <Field label="Location" name="location" defaultValue={initial.location} placeholder="Woburn, MA" />
          <div />
          <div className="md:col-span-2">
            <RichTextArea label="Impact Statement" name="impact" defaultValue={initial.impact} minHeight={90} />
          </div>
          <div className="md:col-span-2">
            <ImageUploader name="logoUrl" defaultValue={initial.logoUrl} label="Company Logo" />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Bullet Points</h2>
        <StringListRepeater
          initial={bullets}
          onChange={setBullets}
          addLabel="Add bullet"
          placeholder="Owned acquisition underwriting, integration performance, FP&A, and exit planning."
        />
      </Card>

      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-between gap-3">
        <Link href="/admin/experience">
          <GhostButton>Cancel</GhostButton>
        </Link>
        <GoldButton type="submit" disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : "Save role"}
        </GoldButton>
      </div>
    </form>
  );
}
