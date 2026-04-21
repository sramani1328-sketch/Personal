"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadResume } from "@/lib/admin/actions";
import { GoldButton, GhostButton } from "@/components/admin/AdminUI";
import { FormFeedback } from "@/components/admin/SaveBar";
import { Upload, FileUp } from "lucide-react";

export function ResumeUploader() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    start(async () => {
      try {
        await uploadResume(fd);
        setFile(null);
        setMsg("Resume uploaded and set as active.");
        router.refresh();
      } catch (err) {
        setMsg("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <div>
      <label className="block border-2 border-dashed border-white/15 rounded-lg p-8 text-center hover:border-gold cursor-pointer transition">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <FileUp size={28} className="mx-auto text-gold mb-3" />
        <p className="text-sm text-white/80">
          {file ? file.name : "Drop a PDF or click to select"}
        </p>
        <p className="text-xs text-white/50 mt-1">Max 10MB · PDF only</p>
      </label>

      <div className="mt-4 flex items-center gap-3">
        <GoldButton onClick={submit} disabled={!file || pending}>
          <Upload size={14} /> {pending ? "Uploading…" : "Upload & publish"}
        </GoldButton>
        {file && <GhostButton onClick={() => setFile(null)}>Clear</GhostButton>}
      </div>
      <FormFeedback message={msg} />
    </div>
  );
}
