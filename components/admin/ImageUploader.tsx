"use client";
import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { GhostButton } from "./AdminUI";
import { uploadImage } from "@/lib/admin/actions";

export function ImageUploader({
  name,
  defaultValue,
  label = "Image",
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [url, setUrl] = useState<string>(defaultValue ?? "");
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const u = await uploadImage(fd);
      setUrl(u);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">{label}</span>
      <div className="mt-1 flex items-center gap-3">
        <div className="h-20 w-20 rounded-md bg-white/5 border border-white/15 overflow-hidden flex items-center justify-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-white/40 text-xs">no image</span>
          )}
        </div>
        <label className="relative">
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          <GhostButton>
            <Upload size={14} /> {busy ? "Uploading…" : "Upload"}
          </GhostButton>
        </label>
        {url ? (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs text-white/50 hover:text-red-300 inline-flex items-center gap-1"
          >
            <Trash2 size={12} /> Clear
          </button>
        ) : null}
      </div>
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
