"use client";
import { useState, useTransition } from "react";
import { saveNav } from "@/lib/admin/actions";
import { Repeater } from "@/components/admin/Repeater";
import { GoldButton } from "@/components/admin/AdminUI";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Save } from "lucide-react";

type NavItem = { label: string; url: string; visible: boolean };

export function NavEditor({ initial }: { initial: NavItem[] }) {
  const [items, setItems] = useState<NavItem[]>(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    const fd = new FormData();
    fd.set("items", JSON.stringify(items));
    start(async () => {
      try {
        await saveNav(fd);
        setMsg("Navigation saved.");
      } catch (e) {
        setMsg("Error: " + (e as Error).message);
      }
    });
  }

  return (
    <div>
      <Repeater
        initial={items}
        onChange={(next) => setItems(next as NavItem[])}
        emptyItem={{ label: "", url: "", visible: true }}
        addLabel="Add nav item"
        fields={[
          { key: "label", label: "Label", span: 4, placeholder: "Blog" },
          { key: "url", label: "URL", span: 6, placeholder: "/blog" },
          { key: "visible", label: "Visible", type: "checkbox", span: 2, placeholder: "Show in nav" },
        ]}
      />
      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 mt-8 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-between gap-3">
        <div className="text-xs text-white/50">Drag order with up/down arrows. Save to publish.</div>
        <GoldButton onClick={save} disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : "Save navigation"}
        </GoldButton>
      </div>
    </div>
  );
}
