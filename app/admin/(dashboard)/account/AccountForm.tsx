"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { changeEmail, changePassword, signOutAllSessions } from "@/lib/admin/actions";
import { Card, Field, GoldButton, GhostButton } from "@/components/admin/AdminUI";
import { FormFeedback } from "@/components/admin/SaveBar";
import { formatDate } from "@/lib/utils";
import { KeyRound, AtSign, LogOut } from "lucide-react";

type Activity = { event: string; ipAddress: string | null; createdAt: string };

export function AccountForm({ email, activity }: { email: string; activity: Activity[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msgE, setMsgE] = useState<string | null>(null);
  const [msgP, setMsgP] = useState<string | null>(null);
  const [msgS, setMsgS] = useState<string | null>(null);

  async function onEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await changeEmail(fd);
        setMsgE("Email updated.");
      } catch (err) {
        setMsgE("Error: " + (err as Error).message);
      }
    });
  }

  async function onPass(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    start(async () => {
      try {
        await changePassword(fd);
        (e.target as HTMLFormElement).reset();
        setMsgP("Password updated.");
      } catch (err) {
        setMsgP("Error: " + (err as Error).message);
      }
    });
  }

  async function revoke() {
    if (!confirm("Sign out all active sessions? You'll be logged out on every device.")) return;
    start(async () => {
      try {
        await signOutAllSessions();
        setMsgS("All sessions revoked. Please log in again.");
        router.push("/admin/login");
      } catch (err) {
        setMsgS("Error: " + (err as Error).message);
      }
    });
  }

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <div className="space-y-6">
        <Card>
          <h2 className="font-display text-lg mb-4 flex items-center gap-2">
            <AtSign size={16} /> Admin email
          </h2>
          <form onSubmit={onEmail} className="space-y-4">
            <Field label="Email" name="email" defaultValue={email} type="email" required />
            <GoldButton type="submit" disabled={pending}>
              Update email
            </GoldButton>
            <FormFeedback message={msgE} />
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4 flex items-center gap-2">
            <KeyRound size={16} /> Change password
          </h2>
          <form onSubmit={onPass} className="space-y-4">
            <Field label="Current password" name="current" type="password" required />
            <Field label="New password (min 10 chars)" name="next" type="password" required />
            <GoldButton type="submit" disabled={pending}>
              Update password
            </GoldButton>
            <FormFeedback message={msgP} />
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4 flex items-center gap-2">
            <LogOut size={16} /> Active sessions
          </h2>
          <p className="text-sm text-white/60 mb-4">
            Signs out every device, including this one. Use this if you suspect unauthorized access.
          </p>
          <GhostButton onClick={revoke} className="text-red-300 border-red-500/30 hover:border-red-400">
            Revoke all sessions
          </GhostButton>
          <FormFeedback message={msgS} />
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg mb-4">Recent activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-white/50">No activity yet.</p>
        ) : (
          <ul className="divide-y divide-white/10 text-sm">
            {activity.map((a, i) => (
              <li key={i} className="py-2.5 flex items-center justify-between gap-4">
                <div>
                  <div className="font-semibold capitalize">{a.event.replace("_", " ")}</div>
                  <div className="text-xs text-white/50">{a.ipAddress ?? "—"}</div>
                </div>
                <div className="text-xs text-white/40 shrink-0">{formatDate(new Date(a.createdAt))}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
