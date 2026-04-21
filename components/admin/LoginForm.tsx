"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Login failed");
      router.push("/admin/verify-otp");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-gold font-semibold">Email</label>
        <input
          name="email"
          type="email"
          required
          className="mt-1 block w-full h-11 rounded-md bg-white/10 border border-white/20 px-3 text-white focus:outline-none focus:border-gold"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-gold font-semibold">Password</label>
        <input
          name="password"
          type="password"
          required
          className="mt-1 block w-full h-11 rounded-md bg-white/10 border border-white/20 px-3 text-white focus:outline-none focus:border-gold"
        />
      </div>
      {err ? <p className="text-xs text-red-300">{err}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-md bg-gold text-navy font-semibold hover:bg-gold-hi disabled:opacity-60"
      >
        {loading ? "Checking…" : "Continue"}
      </button>
    </form>
  );
}
