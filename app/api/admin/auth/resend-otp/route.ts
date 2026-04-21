import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { issueOtp } from "@/lib/auth/otp";

const PENDING_COOKIE = "sr_pending_admin";

export async function POST() {
  const c = await cookies();
  const id = Number(c.get(PENDING_COOKIE)?.value);
  if (!id) return NextResponse.json({ error: "No pending login" }, { status: 400 });
  const [adm] = await db.select().from(admins).where(eq(admins.id, id)).limit(1);
  if (!adm) return NextResponse.json({ error: "Unknown" }, { status: 400 });
  await issueOtp(adm.id, adm.email);
  return NextResponse.json({ ok: true });
}
