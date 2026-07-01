import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { tagQuery } from '@/lib/queries';
import { notFound } from 'next/navigation';

export const revalidate = 600; // Revalidate dynamic routes every 10 minutes

interface TagProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tags = await client.fetch(
    `*[_type == "tag" && defined(slug.current)]{ "slug": slug.current }`
  ).catch(() => []);
  return tags.map((tag: { slug: string }) => ({
    slug: tag.slug,
  }));
}

export async function generateMetadata({ params }: TagProps): Promise<Metadata> {
  const { slug } = await params;
  const tagData = await client.fetch(tagQuery, { slug }).catch(() => null);
  if (!tagData) return {};
  const name = tagData.name;
  return {
    title: `Articles tagged with #${name} — TheAskt`,
    description: `Browse all analytical learning resources and guides tagged under #${name} on TheAskt.`,
    alternates: {
      canonical: `/learn/tag/${slug}`,
    },
  };
}

export default async function TagPage({ params }: TagProps) {
  const { slug } = await params;
  
  // Fetch tag and related items from Sanity
  const tagData = await client.fetch(tagQuery, { slug }).catch(() => null);

  if (!tagData) {
    notFound();
  }

  const name = tagData.name;
  const contents = tagData.contents || [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 space-y-12 animate-fade-in bg-bg-primary text-text-body transition-colors">
      <header className="space-y-4">
        <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-link transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Learn Hub
        </Link>
        <div className="text-[10px] font-bold uppercase tracking-wider text-link font-sans">Tag Archive</div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-text-h sm:text-5xl">#{name}</h1>
        <p className="text-sm text-text-muted">Showing all dynamic learning content tagged under #{name}.</p>
      </header>

      <hr className="border-border-primary" />

      {/* Grid of articles with Tag */}
      {contents.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {contents.map((item: any, idx: number) => (
            <article key={idx} className="p-6 rounded-xl border border-border-primary bg-bg-secondary hover:border-link-hover transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-wider">
                  <span className="font-bold text-link capitalize">{item._type}</span>
                  <span>•</span>
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Recently"}</span>
                </div>
                <Link href={`/learn/${item.slug}`} className="block group">
                  <h3 className="font-serif text-lg font-bold text-text-h group-hover:text-link-hover transition-colors leading-snug">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
              <div className="pt-4 flex items-center justify-between text-xs text-text-muted mt-auto">
                <span>By {item.author?.name || "Editor"}</span>
                <Link href={`/learn/${item.slug}`} className="font-bold text-link hover:text-link-hover transition-colors underline underline-offset-4">
                  Read Article &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-muted text-sm">
          No articles are currently tagged with #{name}. Check back soon!
        </div>
      )}
    </div>
  );
}
