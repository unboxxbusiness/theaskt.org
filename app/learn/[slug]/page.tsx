import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { client, getSanityImageUrl } from '@/lib/sanity';
import { contentDetailQuery } from '@/lib/queries';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { notFound } from 'next/navigation';
import ArticleLayout from "@/components/layout/ArticleLayout";
import Typography from "@/components/typography/Typography";
import Badge from "@/components/ui/Badge";
import SocialShare from "@/components/shared/SocialShare";
import OfflineTracker from "@/components/shared/OfflineTracker";
import Image from 'next/image';
import CustomPortableText from '@/components/shared/CustomPortableText';

export const revalidate = 600; // Revalidate articles every 10 minutes

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await client.fetch(
    `*[_type == "article" && defined(slug.current)][0...20]{ "slug": slug.current }`
  ).catch(() => []);
  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch(contentDetailQuery, { slug }, { next: { revalidate: 0 } }).catch(() => null);
  if (!article) return {};

  const title = article.seoTitle || `${article.title} — TheAskt`;
  const description = article.seoDescription || article.excerpt;
  const canonical = article.canonicalUrl || `/learn/${slug}`;
  const robots = article.noIndex ? { index: false, follow: false } : { index: true, follow: true };
  const ogImage = article.ogImageUrl || article.coverImageUrl;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    }
  };
}

// Calculate dynamic reading time based on content block word counts
function getReadingTime(content: any[] | null | undefined): number {
  if (!content || !Array.isArray(content)) return 1;
  let wordCount = 0;
  content.forEach(block => {
    if (block._type === 'block' && block.children) {
      block.children.forEach((span: any) => {
        if (span.text) wordCount += span.text.trim().split(/\s+/).length;
      });
    }
  });
  return Math.max(1, Math.round(wordCount / 200));
}

export default async function LearnArticle({ params }: PageProps) {
  const { slug } = await params;
  
  // Fetch detailed content item from Sanity
  const article = await client.fetch(contentDetailQuery, { slug }, { next: { revalidate: 0 } }).catch(() => null);

  if (!article) {
    notFound();
  }

  const title = article.title;
  const category = article.categories?.[0];
  const author = article.author || { name: "TheAskt Editorial", biography: "Practical AI career intelligence platform guides." };
  const publishedAt = article.publishedAt || new Date().toISOString();
  const content = article.content || [];
  const coverImageUrl = article.coverImageUrl || null;
  const showNewsletter = article.showNewsletter !== false;

  const readingTime = article.readTime || getReadingTime(article.content);

  // Fetch related articles - First priority: Manually curated articles in Sanity
  let relatedArticles = article.relatedArticles && Array.isArray(article.relatedArticles)
    ? article.relatedArticles.filter(Boolean)
    : [];

  // Second priority (Fallback): Automatically fetch up to 3 articles in the same category
  if (relatedArticles.length === 0 && category?._id) {
    relatedArticles = await client.fetch(
      `*[_type == "article" && references($catId) && slug.current != $currSlug && (status == "published" || !defined(status))] | order(publishedAt desc)[0...3]{
        title,
        "slug": slug.current,
        excerpt
      }`,
      { catId: category._id, currSlug: slug }
    ).catch(() => []);
  }

  // Third priority (Fallback): Automatically fetch up to 3 recent articles globally
  if (relatedArticles.length === 0) {
    relatedArticles = await client.fetch(
      `*[_type == "article" && slug.current != $currSlug && (status == "published" || !defined(status))] | order(publishedAt desc)[0...3]{
        title,
        "slug": slug.current,
        excerpt
      }`,
      { currSlug: slug }
    ).catch(() => []);
  }

  const newsletterBlock = showNewsletter ? (
    <div className="pt-2">
      <NewsletterForm
        heading="Join the Channel"
        description="Subscribe to receive weekly guides and premium career updates."
        buttonText="Subscribe"
        layout="card"
      />
    </div>
  ) : null;

  const relatedBlock = relatedArticles.length > 0 ? (
    <div className="space-y-4 pt-4 border-t border-border-primary">
      <Typography variant="h3" className="text-base font-bold">Related Guides</Typography>
      <div className="space-y-4">
        {relatedArticles.map((rel: any, idx: number) => (
          <Link key={idx} href={`/learn/${rel.slug}`} className="group block p-4 rounded-xl border border-border-primary bg-bg-secondary hover:border-link-hover transition-all">
            <h4 className="font-serif text-xs font-semibold text-text-h group-hover:text-link-hover line-clamp-1 mb-1.5 transition-colors">{rel.title}</h4>
            <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed">{rel.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  ) : null;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": title,
    "image": coverImageUrl ? [coverImageUrl] : [],
    "datePublished": publishedAt,
    "dateModified": publishedAt,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": `${baseUrl}/learn/author/${author.slug || 'editor'}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "TheAskt",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "description": article.excerpt || article.seoDescription
  };

  /* ponytail: refactored article details view to inherit layout wrappers and card components */
  return (
    <ArticleLayout
      title={title}
      category={category?.name}
      categorySlug={category?.slug}
      authorName={author.name}
      publishDate={publishedAt}
      readingTime={readingTime}
      coverImageUrl={coverImageUrl}
      newsletterBlock={newsletterBlock}
      relatedBlock={relatedBlock}
      content={content}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <CustomPortableText value={content} />

      {/* Article Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-border-primary">
          {article.tags.map((tag: any, idx: number) => (
            <Link
              key={idx}
              href={`/learn/tag/${tag.slug}`}
              className="rounded-full bg-bg-secondary border border-border-primary px-3 py-1 text-xs text-text-secondary hover:bg-bg-section-alt hover:text-text-h transition-colors"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Author Bio Panel */}
      <footer className="pt-8 border-t border-border-primary space-y-6">
        <div className="p-5 rounded-xl border border-border-primary bg-bg-secondary flex gap-4">
          <div className="h-10 w-10 rounded-full bg-border-primary flex-shrink-0" />
          <div className="space-y-1">
            <Typography variant="h3" className="text-xs font-bold">About {author.name}</Typography>
            <Typography variant="small" className="leading-relaxed block">{author.biography}</Typography>
          </div>
        </div>
        <div className="flex justify-end">
          <SocialShare title={title} />
        </div>
      </footer>
      <OfflineTracker slug={slug} title={title} excerpt={article.excerpt} />
    </ArticleLayout>
  );
}
