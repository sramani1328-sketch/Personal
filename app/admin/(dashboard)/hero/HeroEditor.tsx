"use client";
import { useState, useTransition } from "react";
import { saveHero } from "@/lib/admin/actions";
import { Card, Field, TextArea, GoldButton } from "@/components/admin/AdminUI";
import { RichTextArea } from "@/components/admin/RichTextArea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Repeater, StringListRepeater } from "@/components/admin/Repeater";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Save } from "lucide-react";

type Stat = { number: string; label: string };

export function HeroEditor({
  initial,
}: {
  initial: {
    eyebrow: string;
    h1: string;
    subheadline: string;
    body: string;
    primary_cta_label: string;
    primary_cta_url: string;
    secondary_cta_label: string;
    secondary_cta_url: string;
    headshot_url: string;
    words: string[];
    stats: Stat[];
  };
}) {
  const [words, setWords] = useState<string[]>(initial.words);
  const [stats, setStats] = useState<Stat[]>(initial.stats);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("_words", JSON.stringify(words));
    fd.set("_stats", JSON.stringify(stats));
    start(async () => {
      try {
        await saveHero(fd);
        setMsg("Hero saved.");
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <h2 className="font-display text-lg mb-4">Copy</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Eyebrow" name="eyebrow" defaultValue={initial.eyebrow} />
          <Field label="H1" name="h1" defaultValue={initial.h1} />
          <div className="md:col-span-2">
            <Field label="Subheadline" name="subheadline" defaultValue={initial.subheadline} />
          </div>
          <div className="md:col-span-2">
            <RichTextArea
              label="Body"
              name="body"
              defaultValue={initial.body}
              placeholder="Working directly with the CEO…"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">CTAs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Primary CTA Label" name="primary_cta_label" defaultValue={initial.primary_cta_label} />
          <Field label="Primary CTA URL" name="primary_cta_url" defaultValue={initial.primary_cta_url} />
          <Field
            label="Secondary CTA Label"
            name="secondary_cta_label"
            defaultValue={initial.secondary_cta_label}
          />
          <Field
            label="Secondary CTA URL"
            name="secondary_cta_url"
            defaultValue={initial.secondary_cta_url}
          />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Headshot</h2>
        <ImageUploader name="headshot_url" defaultValue={initial.headshot_url} label="Hero Headshot" />
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Typing Words</h2>
        <p className="text-sm text-white/50 mb-3">Words that cycle in the rotating badge.</p>
        <StringListRepeater
          initial={words}
          onChange={setWords}
          addLabel="Add word"
          placeholder="FP&A Strategist"
        />
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Stats Strip</h2>
        <Repeater
          initial={stats}
          onChange={(next) => setStats(next as Stat[])}
          emptyItem={{ number: "", label: "" }}
          addLabel="Add stat"
          fields={[
            { key: "number", label: "Number", span: 4, placeholder: "5+" },
            { key: "label", label: "Label", span: 8, placeholder: "Years in Finance" },
          ]}
        />
      </Card>

      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-end gap-3">
        <GoldButton type="submit" disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : "Save hero"}
        </GoldButton>
      </div>
    </form>
  );
}
