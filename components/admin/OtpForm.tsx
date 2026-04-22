"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function OtpForm() {
  const router = useRouter();
  const search = useSearchParams();
  const bootstrap = search.get("bootstrap") ?? "";
  const [digits, setDigits] = useState<string[]>(() => {
    if (bootstrap && /^\d{6}$/.test(bootstrap)) return bootstrap.split("");
    return Array(6).fill("");
  });
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(60);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(id);
  }, [resendIn]);

  function onChange(i: number, v: string) {
    const value = v.replace(/\D/g, "").slice(0, 1);
    setDigits((d) => {
      const n = [...d];
      n[i] = value;
      return n;
    });
    if (value && i < 5) inputs.current[i + 1]?.focus();
  }

  function onKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  }

  function onPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const code = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (code.length === 6) {
      setDigits(code.split(""));
      inputs.current[5]?.focus();
      e.preventDefault();
    }
  }

  async function submit() {
    const code = digits.join("");
    if (code.length !== 6) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Invalid code");
      router.push("/admin/dashboard");
    } catch (e: any) {
      setErr(e.message);
      setDigits(Array(6).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    setErr(null);
    const res = await fetch("/api/admin/auth/resend-otp", { method: "POST" });
    if (res.ok) setResendIn(60);
    else setErr("Could not resend code");
  }

  return (
    <div className="space-y-5">
      {bootstrap ? (
        <div className="rounded-md border border-gold/40 bg-gold/10 p-3 text-xs text-gold">
          Email delivery isn’t configured yet, so your one-time code is shown here:
          <span className="block mt-1 font-mono text-lg tracking-[0.4em] text-white">{bootstrap}</span>
          <span className="block mt-1 text-white/70">Add a RESEND_API_KEY env var to send real emails.</span>
        </div>
      ) : null}
      <div className="flex gap-2 justify-between" onPaste={onPaste as any}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKey(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-14 w-10 sm:w-12 text-center text-2xl rounded-md bg-white/10 border border-white/20 text-white font-mono focus:outline-none focus:border-gold"
          />
        ))}
      </div>
      {err ? <p className="text-xs text-red-300">{err}</p> : null}
      <button
        onClick={submit}
        disabled={loading || digits.some((d) => !d)}
        className="w-full h-11 rounded-md bg-gold text-navy font-semibold hover:bg-gold-hi disabled:opacity-60"
      >
        {loading ? "Verifying…" : "Verify"}
      </button>
      <button
        type="button"
        onClick={resend}
        disabled={resendIn > 0}
        className="w-full text-xs text-white/60 hover:text-gold disabled:opacity-50"
      >
        {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
      </button>
    </div>
  );
}
