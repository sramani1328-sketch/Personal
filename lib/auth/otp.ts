import "server-only";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { otpCodes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { sendOtpEmail } from "@/lib/email/resend";

const OTP_TTL_MIN = 10;
export const MAX_OTP_ATTEMPTS = 3;
export const LOCKOUT_MIN = 30;

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function issueOtp(adminId: number, email: string) {
  const code = generateOtp();
  const hash = await bcrypt.hash(code, 10);
  await db.insert(otpCodes).values({
    adminId,
    codeHash: hash,
    expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
  });
  if (process.env.LOCAL_DEV === "1") console.log(`[DEV OTP for ${email}]: ${code}`);
  let emailSent = false;
  try {
    await sendOtpEmail(email, code);
    emailSent = !!process.env.RESEND_API_KEY;
  } catch (e) {
    console.warn("sendOtpEmail failed", (e as Error).message);
  }
  // When Resend is not yet configured, surface the code in the response so the
  // owner can still access admin. Disappears as soon as RESEND_API_KEY is set.
  const bootstrapCode = !process.env.RESEND_API_KEY ? code : undefined;
  return { expiresIn: OTP_TTL_MIN * 60, emailSent, bootstrapCode };
}

export async function verifyOtp(adminId: number, code: string): Promise<"ok" | "expired" | "wrong" | "locked"> {
  const rows = await db
    .select()
    .from(otpCodes)
    .where(eq(otpCodes.adminId, adminId))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);
  if (!rows.length) return "wrong";
  const otp = rows[0];
  if (otp.used) return "wrong";
  if (otp.expiresAt < new Date()) return "expired";
  if (otp.attempts >= MAX_OTP_ATTEMPTS) return "locked";

  const ok = await bcrypt.compare(code, otp.codeHash);
  if (!ok) {
    await db
      .update(otpCodes)
      .set({ attempts: otp.attempts + 1 })
      .where(eq(otpCodes.id, otp.id));
    if (otp.attempts + 1 >= MAX_OTP_ATTEMPTS) return "locked";
    return "wrong";
  }

  await db.update(otpCodes).set({ used: true }).where(eq(otpCodes.id, otp.id));
  return "ok";
}
