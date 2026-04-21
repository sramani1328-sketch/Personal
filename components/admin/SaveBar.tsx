"use client";
import { useFormStatus } from "react-dom";
import { GoldButton, GhostButton } from "./AdminUI";
import { Save } from "lucide-react";

export function SaveBar({
  right,
  label = "Save changes",
}: {
  right?: React.ReactNode;
  label?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-6 md:-mx-10 mt-8 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-between gap-3">
      <div className="text-xs text-white/50">
        {pending ? "Saving…" : "Changes are not saved until you click Save."}
      </div>
      <div className="flex items-center gap-3">
        {right}
        <GoldButton type="submit" disabled={pending}>
          <Save size={14} /> {pending ? "Saving…" : label}
        </GoldButton>
      </div>
    </div>
  );
}

export function FormFeedback({ message }: { message: string | null }) {
  if (!message) return null;
  const isErr = message.toLowerCase().startsWith("error");
  return (
    <div
      className={`mt-4 rounded-md px-4 py-2 text-sm ${
        isErr
          ? "bg-red-500/10 border border-red-500/30 text-red-200"
          : "bg-gold/10 border border-gold/30 text-gold"
      }`}
    >
      {message}
    </div>
  );
}
