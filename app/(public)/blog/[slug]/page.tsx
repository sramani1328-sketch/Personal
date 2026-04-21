import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { formatDate, readingTime, excerpt } from "@/lib/utils";
import { getPostBySlug } from "@/lib/content";
import { ShareRow } from "@/components/public/ShareRow";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || excerpt(post.bodyHtml ?? ""),
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || excerpt(post.bodyHtml ?? ""),
      images: post.ogImageUrl || post.coverImageUrl ? [{ url: post.ogImageUrl || post.coverImageUrl! }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const [cat] = post.categoryId
    ? await db.select().from(blogCategories).where(eq(blogCategories.id, post.categoryId)).limit(1)
    : [];

  const related = post.categoryId
    ? await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.status, "published"),
            eq(blogPosts.categoryId, post.categoryId),
            ne(blogPosts.id, post.id),
          ),
        )
        .orderBy(desc(blogPosts.publishedAt))
        .limit(3)
        .catch(() => [])
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImageUrl ? [post.coverImageUrl] : [],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: "Shoaib Ramani" },
    description: post.metaDescription || post.excerpt || excerpt(post.bodyHtml ?? ""),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.coverImageUrl ? (
        <div className="relative h-[340px] md:h-[440px] w-full bg-navy">
          <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover opacity-85" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent" />
        </div>
      ) : null}

      <div className="container-page py-14 md:py-20 grid lg:grid-cols-[1fr_3fr] gap-12">
        <aside className="lg:sticky lg:top-24 h-fit">
          <p className="text-xs uppercase tracking-widest text-gold font-semibold">Share</p>
          <div className="mt-3">
            <ShareRow title={post.title} />
          </div>
        </aside>
        <div>
          {cat ? (
            <span className="inline-block text-[11px] uppercase tracking-widest font-semibold text-gold">
              {cat.name}
            </span>
          ) : null}
          <h1 className="mt-3 font-display text-h1 text-navy">{post.title}</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted">
            <div className="inline-flex h-8 w-8 rounded-full bg-navy text-gold items-center justify-center font-display text-xs font-bold">
              SR
            </div>
            <span>Shoaib Ramani</span>
            <span>·</span>
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{readingTime(post.bodyHtml ?? "")} min read</span>
          </div>

          <div
            className="mt-10 prose-sr"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml ?? "" }}
          />

          {related.length ? (
            <section className="mt-20">
              <span className="gold-rule">Related</span>
              <div className="mt-6 grid md:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="block rounded-xl bg-white border border-border p-5 hover:-translate-y-0.5 hover:shadow-cardHover transition-all"
                  >
                    <h4 className="font-display text-base font-semibold text-navy">{r.title}</h4>
                    <p className="mt-2 text-xs text-muted">{formatDate(r.publishedAt)}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-16">
            <Link href="/blog" className="text-navy hover:text-gold font-semibold">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
