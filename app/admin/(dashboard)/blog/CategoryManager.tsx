"use client";
import { useState, useTransition } from "react";
import { saveCategories } from "@/lib/admin/actions";
import { Repeater } from "@/components/admin/Repeater";
import { GoldButton } from "@/components/admin/AdminUI";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Save } from "lucide-react";

type Cat = { name: string; slug: string };

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const [items, setItems] = useState<Cat[]>(initial);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function save() {
    const fd = new FormData();
    fd.set("items", JSON.stringify(items));
    start(async () => {
      try {
        await saveCategories(fd);
        setMsg("Categories saved.");
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <div>
      <Repeater
        initial={items}
        onChange={(next) => setItems(next as Cat[])}
        emptyItem={{ name: "", slug: "" }}
        addLabel="Add category"
        fields={[
          { key: "name", label: "Name", span: 7, placeholder: "M&A" },
          { key: "slug", label: "Slug (auto if blank)", span: 5, placeholder: "m-and-a" },
        ]}
      />
      <FormFeedback message={msg} />
      <div className="mt-4 flex justify-end">
        <GoldButton onClick={save} disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : "Save categories"}
        </GoldButton>
      </div>
    </div>
  );
}
