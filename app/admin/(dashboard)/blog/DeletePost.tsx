"use client";
import { deletePost } from "@/lib/admin/actions";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeletePost({ id, label }: { id: number; label: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${label || "post"}"? This cannot be undone.`)) return;
        const fd = new FormData();
        fd.set("id", String(id));
        start(async () => {
          await deletePost(fd);
        });
      }}
      className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-sm disabled:opacity-50"
    >
      <Trash2 size={13} />
    </button>
  );
}
