import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/db/client";
import { admins, sessions, loginActivity } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "node:crypto";

const SESSION_COOKIE = "sr_admin_session";
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8h

function getSecret() {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET not set");
  return new TextEncoder().encode(s);
}

function sha256(v: string) {
  return crypto.createHash("sha256").update(v).digest("hex");
}

export async function createSession(adminId: number) {
  const jti = crypto.randomUUID();
  const token = await new SignJWT({ sub: String(adminId) })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSecret());

  const h = await headers();
  await db.insert(sessions).values({
    adminId,
    tokenHash: sha256(jti),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    ipAddress: (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
    userAgent: h.get("user-agent") ?? null,
  });

  const c = await cookies();
  c.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });

  await db.insert(loginActivity).values({
    adminId,
    event: "login",
    ipAddress: (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
  });

  return token;
}

export async function getSessionAdmin(): Promise<{ id: number; email: string } | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const jti = payload.jti as string;
    const sub = payload.sub as string;
    if (!jti || !sub) return null;

    const row = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.tokenHash, sha256(jti)), gt(sessions.expiresAt, new Date())))
      .limit(1);
    if (!row.length) return null;

    const adm = await db.select().from(admins).where(eq(admins.id, Number(sub))).limit(1);
    if (!adm.length) return null;
    return { id: adm[0].id, email: adm[0].email };
  } catch {
    return null;
  }
}

export async function destroySession() {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE)?.value;
  c.delete(SESSION_COOKIE);
  if (!token) return;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const jti = payload.jti as string;
    if (jti) await db.delete(sessions).where(eq(sessions.tokenHash, sha256(jti)));
  } catch {
    // noop
  }
}

export async function requireAdmin() {
  const adm = await getSessionAdmin();
  if (!adm) throw new Response("Unauthorized", { status: 401 });
  return adm;
}

export { SESSION_COOKIE };
