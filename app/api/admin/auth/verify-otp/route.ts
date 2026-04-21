import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { admins, loginActivity } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyOtp } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";

const schema = z.object({ code: z.string().regex(/^\d{6}$/) });
const PENDING_COOKIE = "sr_pending_admin";

export async function POST(req: Request) {
  try {
    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid code" }, { status: 400 });

    const c = await cookies();
    const pendingId = Number(c.get(PENDING_COOKIE)?.value);
    if (!pendingId) return NextResponse.json({ error: "No pending login" }, { status: 400 });

    const [adm] = await db.select().from(admins).where(eq(admins.id, pendingId)).limit(1);
    if (!adm) return NextResponse.json({ error: "Unknown admin" }, { status: 400 });

    const status = await verifyOtp(adm.id, body.data.code);
    if (status === "locked") {
      await db.insert(loginActivity).values({ adminId: adm.id, event: "lockout" });
      return NextResponse.json({ error: "Too many attempts. Try again in 30 minutes." }, { status: 429 });
    }
    if (status === "expired") return NextResponse.json({ error: "Code expired" }, { status: 400 });
    if (status === "wrong") {
      await db.insert(loginActivity).values({ adminId: adm.id, event: "otp_fail" });
      return NextResponse.json({ error: "Incorrect code" }, { status: 400 });
    }

    await createSession(adm.id);
    c.delete(PENDING_COOKIE);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
