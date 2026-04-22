"use client";
import { useRef, useState } from "react";
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
  const [err, setErr] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    setErr(null);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const u = await uploadImage(fd);
      setUrl(u);
    } catch (error) {
      const msg = (error as Error).message || "Upload failed";
      setErr(msg);
      console.error("uploadImage failed", error);
    } finally {
      setBusy(false);
      // clear the input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="text-[11px] uppercase tracking-widest text-gold font-semibold">{label}</span>
      <div className="mt-1 flex items-center gap-3 flex-wrap">
        <div className="h-20 w-20 rounded-md bg-white/5 border border-white/15 overflow-hidden flex items-center justify-center shrink-0">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-white/40 text-xs">no image</span>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFile}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
        <GhostButton onClick={() => inputRef.current?.click()}>
          <Upload size={14} /> {busy ? "Uploading…" : url ? "Replace" : "Upload"}
        </GhostButton>
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
      {err ? <p className="mt-2 text-xs text-red-300">{err}</p> : null}
      <input type="hidden" name={name} value={url} />
    </div>
  );
}
