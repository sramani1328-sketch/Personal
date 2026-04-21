import Link from "next/link";
import { db } from "@/lib/db/client";
import { blogCategories, blogPosts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { PageHeader, Card, GoldButton } from "@/components/admin/AdminUI";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Eye } from "lucide-react";
import { DeletePost } from "./DeletePost";
import { CategoryManager } from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function BlogListPage() {
  const [posts, cats] = await Promise.all([
    db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        status: blogPosts.status,
        categoryId: blogPosts.categoryId,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .orderBy(desc(blogPosts.updatedAt))
      .catch(() => []),
    db.select().from(blogCategories).catch(() => []),
  ]);

  const catsMap = Object.fromEntries(cats.map((c) => [c.id, c.name]));

  return (
    <>
      <PageHeader
        title="Blog Posts"
        subtitle="Published posts appear on /blog. Drafts are hidden until published."
        right={
          <Link href="/admin/blog/new">
            <GoldButton>
              <Plus size={14} /> New post
            </GoldButton>
          </Link>
        }
      />

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <Card>
          {posts.length === 0 ? (
            <p className="text-sm text-white/50">
              No posts yet. Publish your first piece to start the archive.
            </p>
          ) : (
            <div className="divide-y divide-white/10">
              {posts.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded ${
                          p.status === "published"
                            ? "bg-gold/20 text-gold"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {p.status}
                      </span>
                      <span className="text-sm font-semibold truncate">{p.title || "Untitled"}</span>
                    </div>
                    <div className="text-xs text-white/50 mt-0.5">
                      {p.categoryId ? `${catsMap[p.categoryId] ?? "—"} · ` : ""}
                      {p.publishedAt ? `Published ${formatDate(p.publishedAt)}` : "Draft"} ·{" "}
                      /blog/{p.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.status === "published" && (
                      <Link
                        href={`/blog/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white text-sm"
                      >
                        <Eye size={13} /> View
                      </Link>
                    )}
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="inline-flex items-center gap-1 h-9 px-3 rounded-md bg-white/5 border border-white/10 text-white/80 hover:text-white text-sm"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                    <DeletePost id={p.id} label={p.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Categories</h2>
          <CategoryManager
            initial={cats.map((c) => ({ name: c.name, slug: c.slug }))}
          />
        </Card>
      </div>
    </>
  );
}
