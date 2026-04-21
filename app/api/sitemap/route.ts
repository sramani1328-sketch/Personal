import { db } from "@/lib/db/client";
import { blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shoaibramani.com";
  const staticRoutes = ["/", "/about", "/experience", "/skills", "/blog", "/resume", "/contact"];
  const posts = await db.select().from(blogPosts).where(eq(blogPosts.status, "published")).catch(() => []);
  const urls = [
    ...staticRoutes.map(
      (r) => `<url><loc>${base}${r}</loc><changefreq>weekly</changefreq></url>`,
    ),
    ...posts.map(
      (p) =>
        `<url><loc>${base}/blog/${p.slug}</loc><lastmod>${(p.updatedAt ?? new Date()).toISOString()}</lastmod></url>`,
    ),
  ].join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
}
