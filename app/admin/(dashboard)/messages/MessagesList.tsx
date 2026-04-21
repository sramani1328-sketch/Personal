"use client";
import { useState, useTransition } from "react";
import { markMessage, deleteMessage } from "@/lib/admin/actions";
import { formatDate } from "@/lib/utils";
import { Trash2, Check, MailOpen, Mail } from "lucide-react";

type Msg = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function MessagesList({ messages }: { messages: Msg[] }) {
  const [openId, setOpenId] = useState<number | null>(messages.find((m) => !m.read)?.id ?? messages[0]?.id ?? null);
  const [, start] = useTransition();

  async function setRead(id: number, read: boolean) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("read", String(read));
    start(async () => {
      await markMessage(fd);
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this message?")) return;
    const fd = new FormData();
    fd.set("id", String(id));
    start(async () => {
      await deleteMessage(fd);
    });
  }

  return (
    <div className="grid md:grid-cols-[320px_1fr] gap-6">
      <ul className="divide-y divide-white/10 max-h-[560px] overflow-y-auto -mx-2">
        {messages.map((m) => {
          const active = openId === m.id;
          return (
            <li key={m.id}>
              <button
                onClick={() => {
                  setOpenId(m.id);
                  if (!m.read) setRead(m.id, true);
                }}
                className={`w-full text-left px-2 py-3 rounded ${active ? "bg-white/5" : "hover:bg-white/5"}`}
              >
                <div className="flex items-center gap-2">
                  {!m.read && <span className="h-2 w-2 rounded-full bg-gold shrink-0" />}
                  <span className="text-sm font-semibold truncate">{m.name}</span>
                </div>
                <div className="text-xs text-white/60 truncate mt-0.5">{m.subject}</div>
                <div className="text-[11px] text-white/40 mt-0.5">
                  {formatDate(new Date(m.createdAt))}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="min-w-0">
        {openId ? (
          (() => {
            const m = messages.find((x) => x.id === openId);
            if (!m) return null;
            return (
              <article className="space-y-4">
                <header className="flex items-start justify-between gap-4 pb-3 border-b border-white/10">
                  <div className="min-w-0">
                    <h2 className="font-display text-xl">{m.subject}</h2>
                    <p className="text-sm text-white/70 mt-1">
                      {m.name} · <a className="text-gold hover:text-gold-hi" href={`mailto:${m.email}`}>{m.email}</a>
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">
                      Received {formatDate(new Date(m.createdAt))}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setRead(m.id, !m.read)}
                      className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white text-sm"
                    >
                      {m.read ? <Mail size={13} /> : <MailOpen size={13} />}{" "}
                      {m.read ? "Mark unread" : "Mark read"}
                    </button>
                    <a
                      href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                      className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-gold text-navy font-semibold text-sm hover:bg-gold-hi"
                    >
                      <Check size={13} /> Reply
                    </a>
                    <button
                      onClick={() => remove(m.id)}
                      className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-300 hover:bg-red-500/20 text-sm"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </header>
                <div className="whitespace-pre-wrap text-sm text-white/85 leading-relaxed">{m.message}</div>
              </article>
            );
          })()
        ) : (
          <p className="text-sm text-white/50">Select a message.</p>
        )}
      </div>
    </div>
  );
}
