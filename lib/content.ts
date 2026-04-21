import { db } from "@/lib/db/client";
import {
  siteSettings,
  navItems,
  heroContent,
  aboutContent,
  statCards,
  typingWords,
  philosophyItems,
  aboutFacts,
  serviceCards,
  experiences,
  experienceBullets,
  skills,
  certifications,
  education,
  blogCategories,
  blogPosts,
  resumeFiles,
} from "@/lib/db/schema";
import { and, asc, desc, eq, inArray } from "drizzle-orm";

export async function kv(
  table: typeof siteSettings | typeof heroContent | typeof aboutContent,
): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(table);
    return Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]));
  } catch {
    return {};
  }
}

export async function getNav() {
  try {
    return await db
      .select()
      .from(navItems)
      .where(eq(navItems.visible, true))
      .orderBy(asc(navItems.order));
  } catch {
    return [];
  }
}

export async function getHero(): Promise<Record<string, any> & { words: any[]; stats: any[] }> {
  const [kvRows, words, stats] = await Promise.all([
    kv(heroContent),
    db.select().from(typingWords).orderBy(asc(typingWords.order)).catch(() => [] as any[]),
    db.select().from(statCards).orderBy(asc(statCards.order)).catch(() => [] as any[]),
  ]);
  return { ...kvRows, words, stats };
}

export async function getServices() {
  try {
    return await db.select().from(serviceCards).orderBy(asc(serviceCards.order));
  } catch {
    return [];
  }
}

export async function getAbout() {
  const [about, philo, facts] = await Promise.all([
    kv(aboutContent),
    db.select().from(philosophyItems).orderBy(asc(philosophyItems.order)).catch(() => []),
    db.select().from(aboutFacts).orderBy(asc(aboutFacts.order)).catch(() => []),
  ]);
  return { about, philo, facts };
}

export async function getExperiences() {
  try {
    const rows = await db.select().from(experiences).orderBy(asc(experiences.order));
    if (!rows.length) return [];
    const ids = rows.map((r) => r.id);
    const bullets = await db
      .select()
      .from(experienceBullets)
      .where(inArray(experienceBullets.experienceId, ids))
      .orderBy(asc(experienceBullets.order));
    return rows.map((r) => ({ ...r, bullets: bullets.filter((b) => b.experienceId === r.id) }));
  } catch {
    return [];
  }
}

export async function getSkills() {
  try {
    return await db.select().from(skills).orderBy(asc(skills.order));
  } catch {
    return [];
  }
}
export async function getCerts() {
  try {
    return await db.select().from(certifications).orderBy(asc(certifications.order));
  } catch {
    return [];
  }
}
export async function getEducation() {
  try {
    return await db.select().from(education).orderBy(asc(education.order));
  } catch {
    return [];
  }
}

export async function getRecentPosts(limit = 3) {
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .orderBy(desc(blogPosts.publishedAt))
      .limit(limit);
  } catch {
    return [];
  }
}

export async function getBlogCategories() {
  try {
    return await db.select().from(blogCategories);
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const [row] = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, slug), eq(blogPosts.status, "published")))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function getActiveResume() {
  try {
    const [row] = await db
      .select()
      .from(resumeFiles)
      .where(eq(resumeFiles.isActive, true))
      .orderBy(desc(resumeFiles.uploadedAt))
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}
