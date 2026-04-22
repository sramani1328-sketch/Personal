import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { excerpt, formatDate, readingTime } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  bodyHtml: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
};

export function BlogTeaser({ posts }: { posts: Post[] }) {
  return (
    <section className="container-page py-14 md:py-28">
      <div className="text-center mb-12">
        <span className="gold-rule">Insights & Thinking</span>
      </div>
      {posts.length ? (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 100}>
              <Link
                href={`/blog/${p.slug}`}
                className="group block rounded-xl bg-white border border-border overflow-hidden hover:shadow-cardHover hover:-translate-y-1 transition-all"
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
                    <div className="absolute inset-0 flex items-center justify-center text-navy/20 font-display text-4xl">
                      SR
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-navy leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted">
                    {p.excerpt || excerpt(p.bodyHtml ?? "")}
                  </p>
                  <div className="mt-4 text-[11px] uppercase tracking-widest text-gold font-semibold">
                    {readingTime(p.bodyHtml ?? "")} min · {formatDate(p.publishedAt)}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl bg-white border border-border p-8 text-center text-muted"
            >
              <div className="font-display text-2xl text-navy/30">SR</div>
              <p className="mt-3 text-sm">New insights coming soon.</p>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-navy hover:text-gold font-semibold"
        >
          View All Posts <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
