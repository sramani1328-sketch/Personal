import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { issueOtp } from "@/lib/auth/otp";

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
const PENDING_COOKIE = "sr_pending_admin";

export async function POST(req: Request) {
  try {
    const body = schema.safeParse(await req.json());
    if (!body.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

    const [adm] = await db.select().from(admins).where(eq(admins.email, body.data.email)).limit(1);
    const fakeHash = "$2a$12$C6UzMDM.H6dfI/f/IKxGh.lQ1qW8l8aV5n9p9B2z9m3y5Hn1q2RaG";
    const hash = adm?.passwordHash ?? fakeHash;
    const ok = await bcrypt.compare(body.data.password, hash);
    if (!adm || !ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const otpResult = await issueOtp(adm.id, adm.email);
    const c = await cookies();
    c.set(PENDING_COOKIE, String(adm.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });
    return NextResponse.json({
      ok: true,
      ...(otpResult.bootstrapCode
        ? { bootstrapCode: otpResult.bootstrapCode, bootstrapNote: "Email not yet configured. Use this code to sign in, then add RESEND_API_KEY to enable real delivery." }
        : {}),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
