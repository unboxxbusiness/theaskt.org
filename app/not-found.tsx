import Link from "next/link";
import { client } from "@/lib/sanity";
import { latestContentQuery } from "@/lib/queries";
import Container from "@/components/layout/Container";
import Typography from "@/components/typography/Typography";
import ArticleCard from "@/components/cards/ArticleCard";
import NotFoundSearch from "@/components/navigation/NotFoundSearch";
import { ArrowRight, Home } from "lucide-react";

export const revalidate = 600; // Cache and revalidate page content

export default async function NotFound() {
  // Fetch latest publications from Sanity to retain bounce traffic
  const latestContent = await client.fetch(latestContentQuery).catch(() => null);
  const recommended = latestContent ? latestContent.slice(0, 3) : [];

  return (
    <Container className="py-20 space-y-16 animate-fade-in max-w-4xl">
      {/* Editorial Error Header */}
      <header className="space-y-6 text-center max-w-2xl mx-auto">
        <Typography 
          variant="display" 
          className="text-8xl sm:text-9xl font-serif font-extrabold tracking-tight text-border-primary/80 dark:text-text-muted/15 select-none"
        >
          404
        </Typography>
        <div className="space-y-3">
          <Typography variant="h1" className="font-serif text-3xl font-bold text-text-h">
            Page Not Found
          </Typography>
          <Typography variant="lead" className="text-text-secondary leading-relaxed text-sm sm:text-base font-sans">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
          </Typography>
        </div>
      </header>

      {/* Dynamic Inline Search Bar */}
      <section className="max-w-xl mx-auto space-y-4">
        <Typography variant="label" className="text-center block text-text-muted mb-2 uppercase tracking-wider text-[10px]">
          Search Publications
        </Typography>
        <NotFoundSearch />
      </section>

      {/* Nav Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center font-sans">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 rounded-full bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-98"
        >
          <Home className="h-3.5 w-3.5" />
          Go to Homepage
        </Link>
        <Link 
          href="/learn" 
          className="inline-flex items-center gap-1.5 rounded-full border border-border-primary hover:bg-bg-secondary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-text-secondary hover:text-text-h transition-all"
        >
          Browse Learn Hub
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Divider */}
      <hr className="border-border-primary" />

      {/* Recommended Articles Section */}
      {recommended.length > 0 && (
        <section className="space-y-8">
          <div className="border-b border-border-primary pb-3">
            <Typography variant="h3" className="font-serif text-lg font-bold text-text-h uppercase tracking-wide">
              Recent Stories from TheAskt
            </Typography>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {recommended.map((item: any, idx: number) => (
              <ArticleCard
                key={idx}
                variant="secondary"
                title={item.title}
                slug={item.slug}
                excerpt={item.excerpt}
                coverImageUrl={item.coverImageUrl}
                categoryName={item.categories?.[0]?.name || "GUIDE"}
                authorName={item.author?.name}
              />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
