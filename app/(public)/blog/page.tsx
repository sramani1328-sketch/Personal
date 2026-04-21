import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db/client";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import { excerpt, formatDate, readingTime } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;
export const metadata = { title: "Blog" };

const PAGE_SIZE = 9;

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10));
  const cats = await db.select().from(blogCategories).catch(() => []);
  const categorySlug = sp.category;
  const cat = cats.find((c) => c.slug === categorySlug);

  const where = cat
    ? and(eq(blogPosts.status, "published"), eq(blogPosts.categoryId, cat.id))
    : eq(blogPosts.status, "published");

  const posts = await db
    .select()
    .from(blogPosts)
    .where(where)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(PAGE_SIZE)
    .offset((page - 1) * PAGE_SIZE)
    .catch(() => []);

  const [{ total }] = (await db.select({ total: count() }).from(blogPosts).where(where).catch(
    () => [{ total: 0 as number }],
  )) as [{ total: number }];
  const totalPages = Math.max(1, Math.ceil(Number(total) / PAGE_SIZE));

  const catName = (id: number | null) => cats.find((c) => c.id === id)?.name ?? "";

  return (
    <div className="container-page py-16 md:py-24">
      <div className="text-center">
        <span className="gold-rule">Insights & Thinking</span>
        <h1 className="mt-4 font-display text-h1 text-navy">Blog</h1>
        <p className="mt-3 text-muted max-w-xl mx-auto">
          M&A, Corporate Finance, Strategy — from the desk of Shoaib Ramani.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2 justify-center">
        <FilterPill href="/blog" active={!categorySlug}>
          All
        </FilterPill>
        {cats.map((c) => (
          <FilterPill key={c.id} href={`/blog?category=${c.slug}`} active={categorySlug === c.slug}>
            {c.name}
          </FilterPill>
        ))}
      </div>

      {posts.length ? (
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-xl bg-white border border-border overflow-hidden hover:shadow-cardHover hover:-translate-y-1 transition-all h-full"
              >
                <div className="aspect-[16/10] bg-navy/5 relative overflow-hidden">
                  {p.coverImageUrl ? (
                    <Image
                      src={p.coverImageUrl}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-navy/20 font-display text-5xl">
                      SR
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {catName(p.categoryId) ? (
                    <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-gold">
                      {catName(p.categoryId)}
                    </span>
                  ) : null}
                  <h3 className="mt-2 font-display text-lg font-semibold text-navy leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {p.excerpt || excerpt(p.bodyHtml ?? "")}
                  </p>
                  <div className="mt-4 text-[11px] uppercase tracking-widest text-muted font-semibold">
                    {readingTime(p.bodyHtml ?? "")} min · {formatDate(p.publishedAt)}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center text-muted">
          <p>No posts yet — check back soon.</p>
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-14 flex justify-center gap-1">
          {Array.from({ length: totalPages }).map((_, i) => {
            const n = i + 1;
            const href = `/blog?${categorySlug ? `category=${categorySlug}&` : ""}page=${n}`;
            const active = n === page;
            return (
              <Link
                key={n}
                href={href}
                className={`h-10 min-w-[2.5rem] px-3 inline-flex items-center justify-center rounded-md text-sm ${
                  active
                    ? "bg-navy text-white"
                    : "bg-white border border-border text-slate hover:border-navy"
                }`}
              >
                {n}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm transition-colors ${
        active
          ? "bg-navy text-white"
          : "bg-white border border-border text-slate hover:border-navy"
      }`}
    >
      {children}
    </Link>
  );
}
