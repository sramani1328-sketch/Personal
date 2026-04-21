import { notFound } from "next/navigation";
import { db } from "@/lib/db/client";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/AdminUI";
import { PostEditor } from "../PostEditor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();
  const [row] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  if (!row) notFound();
  const cats = await db.select().from(blogCategories).catch(() => []);

  return (
    <>
      <PageHeader
        title={row.title || "Untitled"}
        subtitle={`Editing /blog/${row.slug} · ${row.status}`}
      />
      <PostEditor
        categories={cats.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: row.id,
          title: row.title,
          slug: row.slug,
          categoryId: row.categoryId,
          tags: row.tags ?? "",
          coverImageUrl: row.coverImageUrl ?? "",
          excerpt: row.excerpt ?? "",
          bodyHtml: row.bodyHtml ?? "",
          status: row.status,
          publishedAt: row.publishedAt ? row.publishedAt.toISOString().slice(0, 16) : "",
          metaTitle: row.metaTitle ?? "",
          metaDescription: row.metaDescription ?? "",
          ogImageUrl: row.ogImageUrl ?? "",
        }}
      />
    </>
  );
}
