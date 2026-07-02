import Link from 'next/link';
import { client } from '@/lib/sanity';
import { latestContentQuery, categoriesQuery } from '@/lib/queries';
import Container from "@/components/layout/Container";
import ArticleCard from "@/components/cards/ArticleCard";
import LearnHeroCard from "@/components/shared/LearnHeroCard";
import LearnSidebarList from "@/components/shared/LearnSidebarList";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Learn Hub | AI Tutorials, System Guides & Career Blueprints | TheAskt",
  description: "Browse all analytical tutorials, automation guides, system blueprints, and resources curated to build practical AI skills on TheAskt.",
  alternates: {
    canonical: "/learn",
  },
};

export const revalidate = 600;

export default async function LearnIndex() {
  const categories = await client.fetch(categoriesQuery).catch(() => []);
  const latestContent = await client.fetch(latestContentQuery).catch(() => null);

  const items: any[] = latestContent || [];
  const breakingItems = items.filter((a) => a.isBreaking);
  const featuredItem = items.find((a) => a.isFeatured) || items[0];
  const sidebarItems = items.filter((a) => a !== featuredItem).slice(0, 5);
  const gridItems = items.filter((a) => a !== featuredItem).slice(5);

  return (
    <Container className="py-12 space-y-0 animate-fade-in">

      {/* ── Breaking News Ticker ── */}
      {breakingItems.length > 0 && (
        <div className="flex items-center gap-3 bg-red-600 text-white rounded-xl px-4 py-2.5 overflow-hidden mb-6">
          <span className="flex-shrink-0 text-[10px] font-extrabold uppercase tracking-widest border border-white/40 px-2 py-0.5 rounded-full">
            Breaking
          </span>
          <div className="overflow-hidden flex-1 relative">
            <div className="flex gap-8 animate-marquee whitespace-nowrap">
              {breakingItems.concat(breakingItems).map((item: any, i: number) => (
                <a key={i} href={`/learn/${item.slug}`} className="inline-block text-xs font-semibold hover:underline underline-offset-2 flex-shrink-0">
                  {item.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Masthead Header ── */}
      <div className="flex flex-wrap items-end justify-between gap-2 pb-5 border-b-2 border-border-primary">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-text-h">
            Learn Hub
          </h1>
          <p className="text-xs text-text-muted font-sans mt-1">
            AI tutorials, career guides, system design &amp; research
          </p>
        </div>
        <p className="text-[10px] text-text-muted font-sans hidden sm:block">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* ── Category Navigation Bar ── */}
      <nav
        className="flex items-center gap-0 overflow-x-auto border-b border-border-primary mb-8"
        aria-label="Article categories"
      >
        <Link
          href="/learn"
          className="flex-shrink-0 px-4 py-3 text-xs font-bold text-link border-b-2 border-link transition-colors font-sans"
        >
          All
        </Link>
        {(categories as any[]).map((cat, idx) => (
          <Link
            key={idx}
            href={`/learn/category/${cat.slug}`}
            className="flex-shrink-0 px-4 py-3 text-xs font-semibold text-text-muted hover:text-text-h border-b-2 border-transparent hover:border-border-primary transition-colors font-sans whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* ── Empty State ── */}
      {items.length === 0 && (
        <div className="text-center py-20 text-text-muted text-sm border border-dashed border-border-primary rounded-2xl">
          No articles published yet. Check back soon!
        </div>
      )}

      {/* ── Prime Grid: Hero (65%) + Sidebar (35%) ── */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12 mb-12">
          {/* Hero — left 65% */}
          <div className="lg:col-span-8">
            {featuredItem && (
              <LearnHeroCard
                title={featuredItem.title}
                slug={featuredItem.slug}
                excerpt={featuredItem.excerpt}
                publishedAt={featuredItem.publishedAt}
                authorName={featuredItem.author?.name}
                categoryName={featuredItem.categories?.[0]?.name}
                isBreaking={featuredItem.isBreaking}
                isLatest={featuredItem.isLatest}
                isFeatured={featuredItem.isFeatured}
                isSponsored={featuredItem.isSponsored}
              />
            )}
          </div>

          {/* Sidebar — right 35% */}
          <div className="lg:col-span-4 mt-8 lg:mt-0 pt-8 lg:pt-1 border-t lg:border-t-0 lg:border-l border-border-primary lg:pl-10">
            <LearnSidebarList
              articles={sidebarItems.map((item: any) => ({
                title: item.title,
                slug: item.slug,
                authorName: item.author?.name,
                publishedAt: item.publishedAt,
                categoryName: item.categories?.[0]?.name,
              }))}
            />
          </div>
        </div>
      )}

      {/* ── Section Divider ── */}
      {gridItems.length > 0 && (
        <div className="flex items-center justify-between border-t-2 border-border-primary pt-6 mb-8">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-h">
            More from TheAskt
          </span>
          <Link
            href="/learn"
            className="text-xs font-bold text-link hover:text-link-hover transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
      )}

      {/* ── Article Grid (3-column, text-only newspaper style) ── */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-0">
          {gridItems.map((item: any, idx: number) => (
            <ArticleCard
              key={idx}
              variant="newspaper"
              title={item.title}
              slug={item.slug}
              excerpt={item.excerpt}
              publishedAt={item.publishedAt}
              categoryName={item.categories?.[0]?.name}
              authorName={item.author?.name}
              isBreaking={item.isBreaking}
              isLatest={item.isLatest}
              isFeatured={item.isFeatured}
              isSponsored={item.isSponsored}
            />
          ))}
        </div>
      )}

    </Container>
  );
}
