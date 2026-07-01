import Link from 'next/link';
import { client } from '@/lib/sanity';
import { latestContentQuery, categoriesQuery } from '@/lib/queries';
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import ArticleCard from "@/components/cards/ArticleCard";
import Button from "@/components/ui/Button";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Learn Hub | AI Tutorials, System Guides & Career Blueprints | TheAskt",
  description: "Browse all analytical tutorials, automation guides, system blueprints, and resources curated to build practical AI skills on TheAskt.",
  alternates: {
    canonical: "/learn",
  },
};

export const revalidate = 600; // Revalidate dynamic learn route every 10 minutes

export default async function LearnIndex() {
  // Fetch dynamic categories and latest content from Sanity
  const categories = await client.fetch(categoriesQuery).catch(() => []);
  const latestContent = await client.fetch(latestContentQuery).catch(() => null);

  const displayCategories = categories;
  const items = latestContent || [];

  const featuredItem = items[0];
  const streamItems = items.slice(1);

  /* ponytail: refactored LearnHub home using design system cards and container wrappers */
  return (
    <Container className="py-16 space-y-16 animate-fade-in">
      
      {/* Editorial Header */}
      <header className="space-y-4 text-center">
        <Typography variant="display">Learn Hub</Typography>
        <Typography variant="lead" className="max-w-xl mx-auto block leading-6">Deep-dive tutorials, system guides, newsletters, and actionable resource repositories.</Typography>
      </header>

      {/* Categories Bar */}
      <div className="border-y border-border-primary py-5">
        <Typography variant="label" className="text-center sm:text-left mb-4">Filter by Category</Typography>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {displayCategories.map((cat: any, idx: number) => (
            <Link
              key={idx}
              href={`/learn/category/${cat.slug}`}
              className="rounded-full bg-bg-secondary border border-border-primary px-4 py-1.5 text-xs text-text-secondary hover:bg-bg-section-alt hover:text-text-h transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Article Hero */}
      {featuredItem ? (
        <section className="space-y-6 pt-4">
          <ArticleCard
            variant="lead"
            title={featuredItem.title}
            slug={featuredItem.slug}
            excerpt={featuredItem.excerpt}
            coverImageUrl={featuredItem.coverImageUrl}
            publishedAt={featuredItem.publishedAt}
            authorName={featuredItem.author?.name || "Editor"}
            categoryName={featuredItem.categories?.[0]?.name || featuredItem._type}
          />
        </section>
      ) : (
        <div className="text-center py-16 text-text-muted text-sm border border-dashed border-border-primary rounded-2xl">
          No articles or guides published yet. Check back soon!
        </div>
      )}

      {/* Content Stream */}
      {streamItems.length > 0 && (
        <div className="space-y-8 pt-12 border-t border-border-primary">
          <Typography variant="h2" className="uppercase text-left">Latest Stream</Typography>
          <div className="divide-y divide-divider border-t border-border-primary">
            {streamItems.map((item: any, idx: number) => (
              <div key={idx} className="py-8">
                <ArticleCard
                  variant="secondary"
                  title={item.title}
                  slug={item.slug}
                  excerpt={item.excerpt}
                  coverImageUrl={item.coverImageUrl}
                  categoryName={item.categories?.[0]?.name || item._type}
                  authorName={item.author?.name}
                />
                <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
                  <span>By {item.author?.name || "Editor"}</span>
                  <Button variant="link" as={Link} href={`/learn/${item.slug}`}>
                    Read &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </Container>
  );
}
