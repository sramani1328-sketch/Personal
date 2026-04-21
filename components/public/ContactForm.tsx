"use client";
import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    // Client-side validation
    const e2: FieldErrors = {};
    if (!data.name?.trim()) e2.name = "Required";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) e2.email = "Enter a valid email";
    if (!data.subject) e2.subject = "Required";
    if ((data.message ?? "").trim().length < 20) e2.message = "Min 20 characters";
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Something went wrong");
      setDone(true);
      form.reset();
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 className="mx-auto text-gold" size={36} />
        <h3 className="mt-4 font-display text-xl text-navy">Message sent</h3>
        <p className="mt-2 text-muted text-sm max-w-sm mx-auto">
          Thanks — I read every note and will get back within 48 hours.
        </p>
        <button
          onClick={() => setDone(false)}
          className="mt-6 text-sm text-navy hover:text-gold underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Full name" name="name" required error={errors.name} />
      <Field label="Email" name="email" type="email" required error={errors.email} />
      <div>
        <Label>Subject</Label>
        <select
          name="subject"
          className={`${inputCls} ${errors.subject ? "border-red-400" : ""}`}
          defaultValue=""
          required
        >
          <option value="" disabled>
            Choose one
          </option>
          <option>Job Opportunity</option>
          <option>Advisory/Consulting</option>
          <option>Networking</option>
          <option>Other</option>
        </select>
        {errors.subject ? <FieldError>{errors.subject}</FieldError> : null}
      </div>
      <div>
        <Label>Message</Label>
        <textarea
          name="message"
          rows={6}
          minLength={20}
          required
          className={`${inputCls} resize-y ${errors.message ? "border-red-400" : ""}`}
          placeholder="Share a bit of context — the more specific, the better."
        />
        {errors.message ? <FieldError>{errors.message}</FieldError> : null}
      </div>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      {err ? (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5" />
          <span>{err}</span>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : (<><Send size={16} /> Send Message</>)}
      </Button>
    </form>
  );
}

const inputCls =
  "mt-1 block w-full h-11 rounded-md border border-border bg-white px-3 text-sm text-ink focus:outline-none focus:border-navy focus:ring-2 focus:ring-gold/30";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-xs uppercase tracking-widest text-gold font-semibold">{children}</label>;
}

function FieldError({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-red-600">{children}</p>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        className={`${inputCls} ${error ? "border-red-400" : ""}`}
      />
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}
