"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertPost } from "@/lib/admin/actions";
import { Card, Field, TextArea, GoldButton, GhostButton, inputCls, labelCls } from "@/components/admin/AdminUI";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { FormFeedback } from "@/components/admin/SaveBar";
import { slugify } from "@/lib/utils";
import { Save, Send, ArrowLeft, Eye } from "lucide-react";

const TipTap = dynamic(() => import("@/components/admin/TipTap").then((m) => m.TipTap), {
  ssr: false,
  loading: () => (
    <div className="rounded-lg border border-white/15 bg-white/5 min-h-[450px] flex items-center justify-center text-white/40 text-sm">
      Loading editor…
    </div>
  ),
});

type Init = {
  id: number | null;
  title: string;
  slug: string;
  categoryId: number | null;
  tags: string;
  coverImageUrl: string;
  excerpt: string;
  bodyHtml: string;
  status: string;
  publishedAt: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
};

export function PostEditor({
  initial,
  categories,
}: {
  initial: Init;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [status, setStatus] = useState(initial.status);
  const [bodyHtml, setBodyHtml] = useState(initial.bodyHtml);
  const [bodyJson, setBodyJson] = useState<unknown>({});
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  function save(desiredStatus: "draft" | "published") {
    return (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      if (initial.id) fd.set("id", String(initial.id));
      fd.set("status", desiredStatus);
      fd.set("bodyHtml", bodyHtml);
      fd.set("body", JSON.stringify(bodyJson ?? {}));
      if (!fd.get("slug")) fd.set("slug", slugify(String(fd.get("title") || "")));
      start(async () => {
        try {
          const id = await upsertPost(fd);
          setStatus(desiredStatus);
          setMsg(desiredStatus === "published" ? "Post published." : "Draft saved.");
          if (!initial.id && id) router.push(`/admin/blog/${id}`);
        } catch (err) {
          setMsg("Error: " + (err as Error).message);
        }
      });
    };
  }

  return (
    <form onSubmit={save(status === "published" ? "published" : "draft")} className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blog"
          className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold"
        >
          <ArrowLeft size={14} /> All posts
        </Link>
        {initial.id && status === "published" && (
          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold"
          >
            <Eye size={14} /> View live
          </Link>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6 min-w-0">
          <Card>
            <label className="block">
              <span className={labelCls}>Title</span>
              <input
                className={inputCls + " !h-12 !text-lg font-semibold"}
                name="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!initial.id && (!slug || slug === slugify(initial.title))) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                placeholder="Post title"
                required
              />
            </label>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <label className="block">
                <span className={labelCls}>Slug</span>
                <input
                  className={inputCls}
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder="my-post"
                />
              </label>
              <Field label="Tags (comma-separated)" name="tags" defaultValue={initial.tags} />
            </div>
            <div className="mt-4">
              <TextArea
                label="Excerpt"
                name="excerpt"
                defaultValue={initial.excerpt}
                rows={3}
                placeholder="One or two sentences shown on /blog."
              />
            </div>
          </Card>

          <Card>
            <span className={labelCls}>Body</span>
            <div className="mt-2">
              <TipTap
                initialHtml={initial.bodyHtml}
                onUpdate={(html, json) => {
                  setBodyHtml(html);
                  setBodyJson(json);
                }}
              />
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg mb-4">SEO</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Meta title" name="metaTitle" defaultValue={initial.metaTitle} />
              <ImageUploader label="OG image" name="ogImageUrl" defaultValue={initial.ogImageUrl} />
              <div className="md:col-span-2">
                <TextArea
                  label="Meta description"
                  name="metaDescription"
                  defaultValue={initial.metaDescription}
                  rows={2}
                />
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <h2 className="font-display text-lg mb-4">Publish</h2>
            <label className="block">
              <span className={labelCls}>Status</span>
              <select
                name="_statusDisplay"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputCls}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="mt-4">
              <label className="block">
                <span className={labelCls}>Publish date</span>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  defaultValue={initial.publishedAt}
                  className={inputCls}
                />
              </label>
              <p className="text-[11px] text-white/50 mt-1">
                Leave blank to use “now” when you publish.
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <GoldButton type="submit" disabled={pending}>
                <Send size={14} />
                {status === "published" ? "Update & publish" : "Save"}
              </GoldButton>
              {status !== "published" && (
                <button
                  type="submit"
                  onClick={(ev) => {
                    ev.preventDefault();
                    const form = (ev.currentTarget.closest("form") as HTMLFormElement) || null;
                    if (!form) return;
                    // Trigger a submit with published status
                    setStatus("published");
                    form.requestSubmit();
                  }}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-white/15 bg-white/5 text-white/80 hover:text-white hover:border-gold text-sm"
                >
                  <Save size={14} /> Save & publish
                </button>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="font-display text-lg mb-4">Category</h2>
            <label className="block">
              <span className={labelCls}>Category</span>
              <select
                name="categoryId"
                defaultValue={initial.categoryId ?? ""}
                className={inputCls}
              >
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </Card>

          <Card>
            <h2 className="font-display text-lg mb-4">Cover image</h2>
            <ImageUploader name="coverImageUrl" defaultValue={initial.coverImageUrl} label="Cover" />
          </Card>
        </aside>
      </div>

      <FormFeedback message={msg} />
      <div className="sticky bottom-0 -mx-6 md:-mx-10 px-6 md:px-10 py-4 bg-[#0B1729]/95 backdrop-blur border-t border-white/10 flex items-center justify-between gap-3">
        <Link href="/admin/blog">
          <GhostButton>Cancel</GhostButton>
        </Link>
        <GoldButton type="submit" disabled={pending || !title.trim()}>
          <Save size={14} /> {pending ? "Saving…" : status === "published" ? "Update post" : "Save draft"}
        </GoldButton>
      </div>
    </form>
  );
}
