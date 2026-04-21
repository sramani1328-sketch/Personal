"use client";
import { useState, useTransition } from "react";
import { saveAbout, saveServices } from "@/lib/admin/actions";
import { Card, Field, TextArea, GoldButton } from "@/components/admin/AdminUI";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { Repeater } from "@/components/admin/Repeater";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Save } from "lucide-react";

type Philo = { headline: string; subtitle: string };
type Fact = { key: string; value: string };
type Service = { icon: string; title: string; body: string };

export function AboutEditor({
  initial,
}: {
  initial: {
    pull_quote: string;
    bio_html: string;
    personal_touch: string;
    headshot_url: string;
    philo: Philo[];
    facts: Fact[];
    services: Service[];
  };
}) {
  const [philo, setPhilo] = useState<Philo[]>(initial.philo);
  const [facts, setFacts] = useState<Fact[]>(initial.facts);
  const [services, setServices] = useState<Service[]>(initial.services);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("_philo", JSON.stringify(philo));
    fd.set("_facts", JSON.stringify(facts));
    start(async () => {
      try {
        await saveAbout(fd);
        const svcFd = new FormData();
        svcFd.set("items", JSON.stringify(services));
        await saveServices(svcFd);
        setMsg("About and services saved.");
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <h2 className="font-display text-lg mb-4">About Copy</h2>
        <div className="grid gap-4">
          <Field label="Pull Quote" name="pull_quote" defaultValue={initial.pull_quote} />
          <TextArea
            label="Bio (HTML allowed)"
            name="bio_html"
            defaultValue={initial.bio_html}
            rows={10}
          />
          <TextArea
            label="Personal Touch"
            name="personal_touch"
            defaultValue={initial.personal_touch}
            rows={3}
          />
          <ImageUploader name="headshot_url" defaultValue={initial.headshot_url} label="About Headshot" />
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Operating Philosophy</h2>
        <Repeater
          initial={philo}
          onChange={(next) => setPhilo(next as Philo[])}
          emptyItem={{ headline: "", subtitle: "" }}
          addLabel="Add philosophy item"
          fields={[
            { key: "headline", label: "Headline", span: 5, placeholder: "Build systems that scale." },
            { key: "subtitle", label: "Subtitle", span: 7, type: "textarea" },
          ]}
        />
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Quick Facts</h2>
        <Repeater
          initial={facts}
          onChange={(next) => setFacts(next as Fact[])}
          emptyItem={{ key: "", value: "" }}
          addLabel="Add fact"
          fields={[
            { key: "key", label: "Key", span: 4, placeholder: "Based In" },
            { key: "value", label: "Value", span: 8, placeholder: "Woburn, Massachusetts" },
          ]}
        />
      </Card>

      <Card>
        <h2 className="font-display text-lg mb-4">Services (homepage)</h2>
        <Repeater
          initial={services}
          onChange={(next) => setServices(next as Service[])}
          emptyItem={{ icon: "handshake", title: "", body: "" }}
          addLabel="Add service card"
          fields={[
            {
              key: "icon",
              label: "Icon",
              span: 3,
              placeholder: "handshake | line-chart | trending-up",
            },
            { key: "title", label: "Title", span: 9, placeholder: "M&A & Deal Architecture" },
            { key: "body", label: "Body", span: 12, type: "textarea" },
          ]}
        />
      </Card>

      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-end gap-3">
        <GoldButton type="submit" disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : "Save about"}
        </GoldButton>
      </div>
    </form>
  );
}
