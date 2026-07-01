import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { categoryQuery } from '@/lib/queries';
import { notFound } from 'next/navigation';

export const revalidate = 600; // Revalidate dynamic routes every 10 minutes

interface CategoryProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await client.fetch(
    `*[_type == "category" && defined(slug.current)]{ "slug": slug.current }`
  ).catch(() => []);
  return categories.map((cat: { slug: string }) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = await client.fetch(categoryQuery, { slug }).catch(() => null);
  if (!categoryData) return {};
  const name = categoryData.name;
  return {
    title: `${name} Articles & Guides — TheAskt`,
    description: categoryData.description || `Explore our catalog of learning resources related to ${name}.`,
    alternates: {
      canonical: `/learn/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryProps) {
  const { slug } = await params;
  
  // Fetch category and all related content items from Sanity
  const categoryData = await client.fetch(categoryQuery, { slug }).catch(() => null);

  if (!categoryData) {
    notFound();
  }

  const name = categoryData.name;
  const description = categoryData.description || `Explore our catalog of learning resources related to ${name}.`;
  const contents = categoryData.contents || [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 space-y-12 animate-fade-in bg-bg-primary text-text-body transition-colors">
      <header className="space-y-4">
        <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-link transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Learn Hub
        </Link>
        <div className="text-[10px] font-bold uppercase tracking-wider text-link">Category Collection</div>
        <h1 className="font-serif text-4xl font-extrabold tracking-tight text-text-h sm:text-5xl">{name}</h1>
        <p className="text-lg text-text-secondary leading-8 max-w-xl">{description}</p>
      </header>

      <hr className="border-border-primary" />

      {/* Grid of articles in Category */}
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
          No articles are published in this category yet. Check back soon!
        </div>
      )}
    </div>
  );
}
