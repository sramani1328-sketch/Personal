import "server-only";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM ?? "Shoaib Ramani <onboarding@resend.dev>";
const admin = process.env.ADMIN_EMAIL ?? "shoaibramani1@gmail.com";

const resend = apiKey ? new Resend(apiKey) : null;

async function safeSend(opts: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY missing — logging email instead");
    console.log({ to: opts.to, subject: opts.subject });
    return;
  }
  await resend.emails.send({ from, ...opts });
}

export async function sendOtpEmail(to: string, code: string) {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; padding: 32px; max-width: 480px; margin: 0 auto; color:#1A1A2E;">
      <div style="border-top: 3px solid #C9A84C; padding-top: 24px;">
        <h2 style="margin:0 0 8px; color:#1B2A4A;">Admin verification code</h2>
        <p style="color:#5A6B82; margin:0 0 24px;">Enter this code in the admin console. It expires in 10 minutes.</p>
        <div style="font-size: 36px; font-weight: 700; letter-spacing: 12px; background:#F8F9FB; border:1px solid #E2E8F0; padding: 20px; text-align:center; border-radius: 8px; color:#1B2A4A;">${code}</div>
        <p style="color:#5A6B82; margin-top: 24px; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    </div>`;
  await safeSend({ to, subject: `Your Shoaib Ramani admin code: ${code}`, html });
}

export async function sendContactNotification(s: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; padding: 24px; color:#1A1A2E;">
      <h2 style="color:#1B2A4A; margin:0 0 8px;">New message via shoaibramani.com</h2>
      <p style="color:#5A6B82;">${s.subject}</p>
      <table style="border-collapse: collapse; width: 100%;">
        <tr><td style="padding:8px 0;color:#5A6B82">From</td><td style="padding:8px 0">${s.name} &lt;${s.email}&gt;</td></tr>
        <tr><td style="padding:8px 0;color:#5A6B82">Subject</td><td style="padding:8px 0">${s.subject}</td></tr>
      </table>
      <div style="border-top:1px solid #E2E8F0; margin:16px 0; padding-top:16px; white-space: pre-wrap;">${escapeHtml(s.message)}</div>
    </div>`;
  await safeSend({ to: admin, subject: `[shoaibramani.com] ${s.subject} — ${s.name}`, html });
}

export async function sendContactAutoReply(to: string, name: string) {
  const html = `
    <div style="font-family: Inter, system-ui, sans-serif; padding: 24px; max-width: 560px; color:#1A1A2E;">
      <h2 style="color:#1B2A4A; margin:0 0 8px;">Thanks for reaching out, ${escapeHtml(name.split(" ")[0])}.</h2>
      <p style="color:#5A6B82; line-height: 1.6;">Your message reached me — I read every note and will reply within 48 hours.<br/>In the meantime, feel free to connect on <a href="https://www.linkedin.com/in/shoaib-ramani" style="color:#C9A84C;">LinkedIn</a>.</p>
      <p style="margin-top:24px; color:#1B2A4A; font-weight: 600;">— Shoaib</p>
      <p style="color:#5A6B82; font-size:12px;">Corporate Development & Strategic Finance · Woburn, MA</p>
    </div>`;
  await safeSend({ to, subject: "Thanks — I got your message", html });
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}
