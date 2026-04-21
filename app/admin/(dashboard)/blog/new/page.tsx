import { db } from "@/lib/db/client";
import { blogCategories } from "@/lib/db/schema";
import { PageHeader } from "@/components/admin/AdminUI";
import { PostEditor } from "../PostEditor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const cats = await db.select().from(blogCategories).catch(() => []);
  return (
    <>
      <PageHeader title="New post" subtitle="Draft your post. Publish when ready." />
      <PostEditor
        categories={cats.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: null,
          title: "",
          slug: "",
          categoryId: null,
          tags: "",
          coverImageUrl: "",
          excerpt: "",
          bodyHtml: "",
          status: "draft",
          publishedAt: "",
          metaTitle: "",
          metaDescription: "",
          ogImageUrl: "",
        }}
      />
    </>
  );
}
