"use client";
import { useState } from "react";
import { Linkedin, Twitter, Link as LinkIcon, Check } from "lucide-react";

export function ShareRow({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const encoded = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const btn =
    "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-slate hover:border-gold hover:text-navy transition-colors";

  return (
    <div className="flex gap-2">
      <a
        className={btn}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={16} />
      </a>
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?text=${encTitle}&url=${encoded}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share on X"
      >
        <Twitter size={16} />
      </a>
      <button className={btn} onClick={copy} aria-label="Copy link">
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
      </button>
    </div>
  );
}
