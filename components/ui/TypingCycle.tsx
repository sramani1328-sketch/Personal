"use client";
import { useEffect, useState } from "react";

export function TypingCycle({ words, prefix = "I am a " }: { words: string[]; prefix?: string }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const full = words[idx % words.length];
    const speed = deleting ? 40 : 90;
    const t = setTimeout(() => {
      if (!deleting) {
        const next = full.slice(0, text.length + 1);
        setText(next);
        if (next === full) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = full.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setIdx((i) => i + 1);
        }
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, idx, words]);

  return (
    <span className="inline-flex items-center gap-0 font-mono text-sm md:text-base text-slate">
      <span className="text-muted">{prefix}</span>
      <span className="text-navy font-semibold">{text}</span>
      <span className="inline-block w-[2px] h-[1em] bg-gold ml-0.5 animate-blink" aria-hidden />
    </span>
  );
}
