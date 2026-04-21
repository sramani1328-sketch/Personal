import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { contactSubmissions } from "@/lib/db/schema";
import { sendContactAutoReply, sendContactNotification } from "@/lib/email/resend";

const schema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().trim().email().max(320),
  subject: z.enum(["Job Opportunity", "Advisory/Consulting", "Networking", "Other"]),
  message: z.string().trim().min(20).max(5000),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (json?.website) return NextResponse.json({ ok: true }); // silently drop bots
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
    }
    const { name, email, subject, message } = parsed.data;
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;

    await db.insert(contactSubmissions).values({ name, email, subject, message, ipAddress: ip });
    // Fire emails but don't let failures block DB write
    try {
      await Promise.all([
        sendContactNotification({ name, email, subject, message }),
        sendContactAutoReply(email, name),
      ]);
    } catch (e) {
      console.warn("email send failed", e);
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
