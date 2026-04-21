"use client";
import { useState } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { GhostButton, inputCls, labelCls, textAreaCls } from "./AdminUI";

type Item = Record<string, any>;

export function Repeater({
  initial,
  fields,
  addLabel = "Add row",
  emptyItem,
  onChange,
}: {
  initial: Item[];
  fields: {
    key: string;
    label: string;
    type?: "text" | "textarea" | "checkbox";
    placeholder?: string;
    span?: number; // 1..12
  }[];
  addLabel?: string;
  emptyItem: Item;
  onChange: (items: Item[]) => void;
}) {
  const [items, setItems] = useState<Item[]>(initial);

  function update(next: Item[]) {
    setItems(next);
    onChange(next);
  }

  function setField(i: number, key: string, value: any) {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it));
    update(next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  }

  function remove(i: number) {
    update(items.filter((_, idx) => idx !== i));
  }

  function add() {
    update([...items, { ...emptyItem }]);
  }

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/10 bg-white/[0.02] p-4 grid grid-cols-12 gap-3"
        >
          {fields.map((f) => (
            <div key={f.key} className={`col-span-12 ${f.span ? `md:col-span-${f.span}` : "md:col-span-6"}`}>
              <label className="block">
                <span className={labelCls}>{f.label}</span>
                {f.type === "textarea" ? (
                  <textarea
                    className={textAreaCls}
                    rows={3}
                    value={String(it[f.key] ?? "")}
                    onChange={(e) => setField(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                ) : f.type === "checkbox" ? (
                  <label className="mt-2 flex items-center gap-2 text-sm text-white/80">
                    <input
                      type="checkbox"
                      checked={!!it[f.key]}
                      onChange={(e) => setField(i, f.key, e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    <span>{f.placeholder ?? "Enabled"}</span>
                  </label>
                ) : (
                  <input
                    className={inputCls}
                    value={String(it[f.key] ?? "")}
                    onChange={(e) => setField(i, f.key, e.target.value)}
                    placeholder={f.placeholder}
                  />
                )}
              </label>
            </div>
          ))}
          <div className="col-span-12 flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => move(i, -1)}
              className="p-2 rounded hover:bg-white/10 text-white/60"
              aria-label="Move up"
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              onClick={() => move(i, 1)}
              className="p-2 rounded hover:bg-white/10 text-white/60"
              aria-label="Move down"
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-2 rounded hover:bg-white/10 text-red-300"
              aria-label="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
      <GhostButton onClick={add}>
        <Plus size={14} /> {addLabel}
      </GhostButton>
    </div>
  );
}

export function StringListRepeater({
  initial,
  onChange,
  addLabel = "Add item",
  placeholder,
}: {
  initial: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  placeholder?: string;
}) {
  const [items, setItems] = useState<string[]>(initial);

  function update(next: string[]) {
    setItems(next);
    onChange(next);
  }

  return (
    <div className="space-y-2">
      {items.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            value={v}
            onChange={(e) => {
              const next = items.slice();
              next[i] = e.target.value;
              update(next);
            }}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => {
              const j = i - 1;
              if (j < 0) return;
              const next = items.slice();
              [next[i], next[j]] = [next[j], next[i]];
              update(next);
            }}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            aria-label="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              const j = i + 1;
              if (j >= items.length) return;
              const next = items.slice();
              [next[i], next[j]] = [next[j], next[i]];
              update(next);
            }}
            className="p-2 rounded hover:bg-white/10 text-white/60"
            aria-label="Move down"
          >
            <ArrowDown size={14} />
          </button>
          <button
            type="button"
            onClick={() => update(items.filter((_, idx) => idx !== i))}
            className="p-2 rounded hover:bg-white/10 text-red-300"
            aria-label="Remove"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <GhostButton onClick={() => update([...items, ""])}>
        <Plus size={14} /> {addLabel}
      </GhostButton>
    </div>
  );
}
