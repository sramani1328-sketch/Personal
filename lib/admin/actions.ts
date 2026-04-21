"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  aboutContent,
  aboutFacts,
  admins,
  blogCategories,
  blogPosts,
  certifications,
  contactSubmissions,
  education,
  experienceBullets,
  experiences,
  heroContent,
  navItems,
  philosophyItems,
  resumeFiles,
  serviceCards,
  sessions,
  siteSettings,
  skills,
  statCards,
  typingWords,
} from "@/lib/db/schema";
import { getSessionAdmin } from "@/lib/auth/session";
import { uploadToBlob } from "@/lib/blob/upload";
import { slugify } from "@/lib/utils";

async function gate() {
  const adm = await getSessionAdmin();
  if (!adm) throw new Error("Unauthorized");
  return adm;
}

function revalAll() {
  ["/", "/about", "/experience", "/skills", "/blog", "/resume", "/contact"].forEach((p) =>
    revalidatePath(p),
  );
}

// ── KV upsert (site settings / hero / about) ──
type KVTable = typeof siteSettings | typeof heroContent | typeof aboutContent;
async function saveKV(table: KVTable, kv: Record<string, string>) {
  for (const [key, value] of Object.entries(kv)) {
    await db
      .insert(table as any)
      .values({ key, value })
      .onConflictDoUpdate({
        target: (table as any).key,
        set: { value, updatedAt: new Date() },
      });
  }
}

export async function saveSiteSettings(formData: FormData) {
  await gate();
  const data = Object.fromEntries(formData) as Record<string, string>;
  await saveKV(siteSettings, data);
  revalAll();
}

export async function saveHero(formData: FormData) {
  await gate();
  const data = Object.fromEntries(formData) as Record<string, string>;
  // Words/stats come as JSON strings
  const words = JSON.parse(data._words ?? "[]");
  const stats = JSON.parse(data._stats ?? "[]");
  delete (data as any)._words;
  delete (data as any)._stats;
  await saveKV(heroContent, data);
  await db.delete(typingWords);
  for (let i = 0; i < words.length; i++) {
    if (String(words[i]).trim())
      await db.insert(typingWords).values({ word: String(words[i]).trim(), order: i });
  }
  await db.delete(statCards);
  for (let i = 0; i < stats.length; i++) {
    const s = stats[i];
    if (s.number && s.label)
      await db
        .insert(statCards)
        .values({ number: String(s.number), label: String(s.label), order: i });
  }
  revalAll();
}

export async function saveAbout(formData: FormData) {
  await gate();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const philo = JSON.parse(data._philo ?? "[]");
  const facts = JSON.parse(data._facts ?? "[]");
  delete (data as any)._philo;
  delete (data as any)._facts;
  await saveKV(aboutContent, data);
  await db.delete(philosophyItems);
  for (let i = 0; i < philo.length; i++) {
    const p = philo[i];
    if (p.headline) await db.insert(philosophyItems).values({ ...p, order: i });
  }
  await db.delete(aboutFacts);
  for (let i = 0; i < facts.length; i++) {
    const f = facts[i];
    if (f.key) await db.insert(aboutFacts).values({ ...f, order: i });
  }
  revalAll();
}

// ── Nav ──
export async function saveNav(formData: FormData) {
  await gate();
  const items = JSON.parse(formData.get("items") as string);
  await db.delete(navItems);
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.label || !it.url) continue;
    await db.insert(navItems).values({
      label: it.label,
      url: it.url,
      visible: !!it.visible,
      order: i,
    });
  }
  revalAll();
}

// ── Services ──
export async function saveServices(formData: FormData) {
  await gate();
  const items = JSON.parse(formData.get("items") as string);
  await db.delete(serviceCards);
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it.title) continue;
    await db
      .insert(serviceCards)
      .values({ icon: it.icon || "handshake", title: it.title, body: it.body || "", order: i });
  }
  revalAll();
}

// ── Experiences ──
export async function upsertExperience(formData: FormData) {
  await gate();
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const bullets = JSON.parse((formData.get("bullets") as string) || "[]");
  const values = {
    company: String(formData.get("company") || ""),
    role: String(formData.get("role") || ""),
    startDate: String(formData.get("startDate") || ""),
    endDate: String(formData.get("endDate") || "") || null,
    isPresent: formData.get("isPresent") === "on",
    location: String(formData.get("location") || ""),
    logoUrl: String(formData.get("logoUrl") || "") || null,
    impact: String(formData.get("impact") || ""),
  };
  let expId = id;
  if (id) {
    await db.update(experiences).set({ ...values, updatedAt: new Date() }).where(eq(experiences.id, id));
    await db.delete(experienceBullets).where(eq(experienceBullets.experienceId, id));
  } else {
    const max = await db.select({ o: experiences.order }).from(experiences).orderBy(desc(experiences.order)).limit(1);
    const order = (max[0]?.o ?? -1) + 1;
    const [created] = await db.insert(experiences).values({ ...values, order }).returning();
    expId = created.id;
  }
  for (let i = 0; i < bullets.length; i++) {
    const text = String(bullets[i] ?? "").trim();
    if (text) await db.insert(experienceBullets).values({ experienceId: expId!, text, order: i });
  }
  revalAll();
  return expId;
}

export async function deleteExperience(formData: FormData) {
  await gate();
  const id = Number(formData.get("id"));
  await db.delete(experiences).where(eq(experiences.id, id));
  revalAll();
}

export async function reorderExperiences(formData: FormData) {
  await gate();
  const ids: number[] = JSON.parse(formData.get("ids") as string);
  for (let i = 0; i < ids.length; i++) {
    await db.update(experiences).set({ order: i }).where(eq(experiences.id, ids[i]));
  }
  revalAll();
}

// ── Skills / Certs / Education (bulk save) ──
export async function saveSkillsBlock(formData: FormData) {
  await gate();
  const kind = String(formData.get("kind"));
  const items = JSON.parse(formData.get("items") as string);
  if (kind === "skills") {
    await db.delete(skills);
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.name && it.category)
        await db.insert(skills).values({ name: it.name, category: it.category, order: i });
    }
  } else if (kind === "certs") {
    await db.delete(certifications);
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.name)
        await db.insert(certifications).values({
          name: it.name,
          issuingBody: it.issuingBody || "",
          year: it.year || "",
          description: it.description || "",
          order: i,
        });
    }
  } else if (kind === "education") {
    await db.delete(education);
    for (let i = 0; i < items.length; i++) {
      const e = items[i];
      if (e.institution)
        await db.insert(education).values({
          institution: e.institution,
          degree: e.degree || "",
          field: e.field || "",
          startDate: e.startDate || "",
          endDate: e.endDate || "",
          location: e.location || "",
          description: e.description || "",
          order: i,
        });
    }
  }
  revalAll();
}

// ── Blog ──
export async function upsertPost(formData: FormData) {
  await gate();
  const id = formData.get("id") ? Number(formData.get("id")) : null;
  const title = String(formData.get("title") || "");
  const slug = String(formData.get("slug") || slugify(title));
  const status = String(formData.get("status") || "draft");
  const publishedAt = formData.get("publishedAt")
    ? new Date(String(formData.get("publishedAt")))
    : status === "published"
      ? new Date()
      : null;

  const values: any = {
    title,
    slug,
    categoryId: formData.get("categoryId") ? Number(formData.get("categoryId")) : null,
    tags: String(formData.get("tags") || ""),
    coverImageUrl: String(formData.get("coverImageUrl") || "") || null,
    excerpt: String(formData.get("excerpt") || ""),
    bodyHtml: String(formData.get("bodyHtml") || ""),
    body: JSON.parse((formData.get("body") as string) || "{}"),
    status,
    publishedAt,
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    ogImageUrl: String(formData.get("ogImageUrl") || "") || null,
    updatedAt: new Date(),
  };

  if (id) {
    await db.update(blogPosts).set(values).where(eq(blogPosts.id, id));
    revalAll();
    revalidatePath(`/blog/${slug}`);
    return id;
  }
  const [created] = await db.insert(blogPosts).values(values).returning();
  revalAll();
  return created.id;
}

export async function deletePost(formData: FormData) {
  await gate();
  const id = Number(formData.get("id"));
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  revalAll();
}

export async function saveCategories(formData: FormData) {
  await gate();
  const items = JSON.parse(formData.get("items") as string);
  await db.delete(blogCategories);
  for (const c of items) {
    if (c.name)
      await db.insert(blogCategories).values({
        name: c.name,
        slug: c.slug || slugify(c.name),
      });
  }
  revalAll();
}

// ── Resume ──
export async function uploadResume(formData: FormData) {
  await gate();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file");
  if (file.type !== "application/pdf") throw new Error("PDF only");
  const safeName = `resume/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
  const { url } = await uploadToBlob(file, safeName);
  await db.update(resumeFiles).set({ isActive: false });
  await db.insert(resumeFiles).values({ filename: file.name, blobUrl: url, isActive: true });
  revalidatePath("/resume");
}

// ── Messages ──
export async function markMessage(formData: FormData) {
  await gate();
  const id = Number(formData.get("id"));
  const read = formData.get("read") === "true";
  await db.update(contactSubmissions).set({ read }).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/messages");
}
export async function deleteMessage(formData: FormData) {
  await gate();
  const id = Number(formData.get("id"));
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
  revalidatePath("/admin/messages");
}

// ── Account ──
export async function changePassword(formData: FormData) {
  const adm = await gate();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  if (next.length < 10) throw new Error("Password must be at least 10 characters");
  const [row] = await db.select().from(admins).where(eq(admins.id, adm.id)).limit(1);
  if (!row) throw new Error("Unknown admin");
  const ok = await bcrypt.compare(current, row.passwordHash);
  if (!ok) throw new Error("Current password incorrect");
  const hash = await bcrypt.hash(next, 12);
  await db.update(admins).set({ passwordHash: hash }).where(eq(admins.id, adm.id));
}

export async function changeEmail(formData: FormData) {
  const adm = await gate();
  const email = String(formData.get("email") || "");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Invalid email");
  await db.update(admins).set({ email }).where(eq(admins.id, adm.id));
}

export async function signOutAllSessions() {
  const adm = await gate();
  await db.delete(sessions).where(eq(sessions.adminId, adm.id));
}

// ── Generic blob upload used by inline uploaders (headshots, cover images) ──
export async function uploadImage(formData: FormData): Promise<string> {
  await gate();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) throw new Error("No file");
  const ext = file.name.split(".").pop() ?? "bin";
  const safeName = `media/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
  const { url } = await uploadToBlob(file, safeName);
  return url;
}
