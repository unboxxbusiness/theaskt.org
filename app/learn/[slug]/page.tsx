import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { contentDetailQuery } from '@/lib/queries';
import NewsletterForm from '@/components/forms/NewsletterForm';
import { notFound } from 'next/navigation';
import ArticleLayout from "@/components/layout/ArticleLayout";
import Typography from "@/components/typography/Typography";
import Badge from "@/components/ui/Badge";
import SocialShare from "@/components/shared/SocialShare";
import OfflineTracker from "@/components/shared/OfflineTracker";
import Image from 'next/image';

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

// Helper to group consecutive list item blocks of the same type together
function groupConsecutiveLists(blocks: any[]): any[] {
  const result: any[] = [];
  let currentList: { type: string; items: any[] } | null = null;

  for (const block of blocks) {
    if (block._type === 'block' && block.listItem) {
      if (currentList && currentList.type === block.listItem) {
        currentList.items.push(block);
      } else {
        if (currentList) {
          result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
        }
        currentList = { type: block.listItem, items: [block] };
      }
    } else {
      if (currentList) {
        result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
        currentList = null;
      }
      result.push(block);
    }
  }

  if (currentList) {
    result.push({ _type: 'listGroup', listItem: currentList.type, children: currentList.items });
  }

  return result;
}

// Native Portable Text Renderer for absolute zero external package dependency
function CustomPortableText({ value }: { value: any[] | null | undefined }) {
  if (!value || !Array.isArray(value)) return null;

  const groupedBlocks = groupConsecutiveLists(value);

  return (
    <div className="space-y-6">
      {groupedBlocks.map((block: any, index: number) => {
        // Render Grouped Bullet/Number Lists
        if (block._type === 'listGroup') {
          const Tag = block.listItem === 'bullet' ? 'ul' : 'ol';
          const listClass = block.listItem === 'bullet' 
            ? 'list-disc pl-6 space-y-2.5 my-4 text-text-body font-sans' 
            : 'list-decimal pl-6 space-y-2.5 my-4 text-text-body font-sans';
          return (
            <Tag key={index} className={listClass}>
              {block.children.map((item: any, itemIdx: number) => {
                const itemChildren = item.children || [];
                const renderItemChildren = () => {
                  return itemChildren.map((span: any, sIdx: number) => {
                    let content = span.text;
                    if (span.marks && span.marks.length > 0) {
                      // Inline Links resolution from list item markDefs
                      const linkDef = item.markDefs?.find((def: any) => span.marks.includes(def._key));
                      if (linkDef && linkDef._type === 'link') {
                        const isInternal = linkDef.href?.startsWith('/') || linkDef.href?.includes('theaskt.com');
                        const href = linkDef.href || '#';
                        if (isInternal) {
                          content = (
                            <Link 
                              key={sIdx} 
                              href={href} 
                              className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                            >
                              {content}
                            </Link>
                          );
                        } else {
                          content = (
                            <a 
                              key={sIdx} 
                              href={href} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                            >
                              {content}
                            </a>
                          );
                        }
                      }
                      
                      if (span.marks.includes('strong')) content = <strong key={sIdx} className="font-bold text-text-h">{content}</strong>;
                      if (span.marks.includes('em')) content = <em key={sIdx} className="italic">{content}</em>;
                      if (span.marks.includes('code')) {
                        content = (
                          <code key={sIdx} className="bg-bg-code border border-border-primary px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-text-h">
                            {content}
                          </code>
                        );
                      }
                    }
                    return <span key={sIdx}>{content}</span>;
                  });
                };
                return (
                  <li key={itemIdx} className="text-sm sm:text-base leading-relaxed">
                    {renderItemChildren()}
                  </li>
                );
              })}
            </Tag>
          );
        }

        if (block._type === 'block') {
          const style = block.style || 'normal';
          const children = block.children || [];

          const renderChildren = () => {
            return children.map((span: any, sIdx: number) => {
              let content = span.text;
              if (span.marks && span.marks.length > 0) {
                // Inline Links resolution from block markDefs
                const linkDef = block.markDefs?.find((def: any) => span.marks.includes(def._key));
                if (linkDef && linkDef._type === 'link') {
                  const isInternal = linkDef.href?.startsWith('/') || linkDef.href?.includes('theaskt.com');
                  const href = linkDef.href || '#';
                  if (isInternal) {
                    content = (
                      <Link 
                        key={sIdx} 
                        href={href} 
                        className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                      >
                        {content}
                      </Link>
                    );
                  } else {
                    content = (
                      <a 
                        key={sIdx} 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-link hover:text-link-hover font-semibold transition-colors underline decoration-dotted decoration-1 underline-offset-4"
                      >
                        {content}
                      </a>
                    );
                  }
                }

                if (span.marks.includes('strong')) content = <strong key={sIdx} className="font-bold text-text-h">{content}</strong>;
                if (span.marks.includes('em')) content = <em key={sIdx} className="italic">{content}</em>;
                if (span.marks.includes('code')) {
                  content = (
                    <code key={sIdx} className="bg-bg-code border border-border-primary px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-text-h">
                      {content}
                    </code>
                  );
                }
              }
              return <span key={sIdx}>{content}</span>;
            });
          };

          if (style === 'h1') return <Typography variant="h1" key={index} className="pt-8 text-text-h font-serif font-extrabold">{renderChildren()}</Typography>;
          if (style === 'h2') return <Typography variant="h2" key={index} className="pt-6 text-text-h font-serif font-bold">{renderChildren()}</Typography>;
          if (style === 'h3') return <Typography variant="h3" key={index} className="pt-4 text-text-h font-serif font-bold">{renderChildren()}</Typography>;
          if (style === 'blockquote') {
            return (
              <blockquote key={index} className="border-l-4 border-[#FCA311] pl-5 italic text-text-secondary my-6 text-base leading-[1.8] font-serif py-1">
                {renderChildren()}
              </blockquote>
            );
          }

          return <p key={index} className="text-sm sm:text-base leading-[1.8] text-text-body font-serif">{renderChildren()}</p>;
        }

        // Render dynamic image block from Sanity CDN
        if (block._type === 'image' && block.asset?._ref) {
          const ref = block.asset._ref;
          const parts = ref.split('-');
          const assetId = parts[1];
          const dimensions = parts[2];
          const extension = parts[3];
          const imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lg2rm1yc'}/${process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'}/${assetId}-${dimensions}.${extension}`;
          
          const imageElement = (
            <div className="relative w-full h-96 rounded-lg border border-border-primary overflow-hidden hover:opacity-95 transition-opacity">
              <Image src={imageUrl} alt={block.alt || "Editorial Illustration"} fill className="object-cover" />
            </div>
          );

          const renderClickableImage = () => {
            if (block.href) {
              const isInternal = block.href.startsWith('/') || block.href.includes('theaskt.com');
              if (isInternal) {
                return (
                  <Link href={block.href} className="cursor-pointer block">
                    {imageElement}
                  </Link>
                );
              }
              return (
                <a href={block.href} target="_blank" rel="noopener noreferrer" className="cursor-pointer block">
                  {imageElement}
                </a>
              );
            }
            return imageElement;
          };

          return (
            <figure key={index} className="my-8">
              {renderClickableImage()}
              {block.caption && <figcaption className="text-center text-xs text-text-caption mt-2.5 font-sans">{block.caption}</figcaption>}
            </figure>
          );
        }

        // Render pullQuote block
        if (block._type === 'pullQuote') {
          return (
            <blockquote key={index} className="border-l-4 border-amber-500 pl-5 italic text-lg my-6 text-text-secondary leading-relaxed font-serif py-1">
              "{block.quote}"
              {block.attribution && (
                <cite className="block text-xs font-sans text-text-muted mt-2 not-italic font-semibold">
                  — {block.attribution}
                </cite>
              )}
            </blockquote>
          );
        }

        // Render videoEmbed block
        if (block._type === 'videoEmbed' && block.url) {
          let embedUrl = block.url;
          if (block.url.includes('youtube.com/watch')) {
            const urlParams = new URLSearchParams(new URL(block.url).search);
            const videoId = urlParams.get('v');
            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
          } else if (block.url.includes('youtu.be/')) {
            const videoId = block.url.split('/').pop();
            if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
          return (
            <div key={index} className="aspect-video my-8 w-full rounded-lg overflow-hidden border border-border-primary">
              <iframe
                src={embedUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          );
        }

        // Render codeBlock
        if (block._type === 'codeBlock') {
          return (
            <div key={index} className="my-6 rounded-lg overflow-hidden border border-border-primary bg-bg-code p-4">
              {block.language && (
                <div className="text-[10px] text-text-muted uppercase tracking-wider font-sans font-bold border-b border-border-primary pb-2 mb-3">
                  {block.language}
                </div>
              )}
              <pre className="font-mono text-xs overflow-x-auto text-text-h leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Render simpleTable (Excel copy-paste TSV/CSV or Manual rows)
        if (block._type === 'simpleTable') {
          let parsedRows: string[][] = [];
          
          if (block.csvData) {
            const lines = block.csvData.split(/\r?\n/).map((line: string) => line.trim()).filter(Boolean);
            parsedRows = lines.map((line: string) => {
              // Detect tab separation first (which is Excel/Sheets clipboard standard)
              if (line.includes('\t')) {
                return line.split('\t');
              }
              // Fallback to comma separation
              return line.split(',');
            });
          } else if (block.rows && Array.isArray(block.rows)) {
            parsedRows = block.rows.map((row: any) => row.cells || []);
          }

          if (parsedRows.length === 0) return null;

          return (
            <div key={index} className="my-6 overflow-x-auto rounded-lg border border-border-primary">
              <table className="min-w-full divide-y divide-border-primary text-xs sm:text-sm text-left">
                <tbody className="divide-y divide-border-primary bg-bg-secondary">
                  {parsedRows.map((row: string[], rIdx: number) => {
                    const isHeader = rIdx === 0 && block.csvData; // Treat first row as header if pasted from sheet
                    return (
                      <tr 
                        key={rIdx} 
                        className={
                          isHeader 
                            ? 'bg-bg-section-alt font-bold border-b border-border-primary text-text-h' 
                            : rIdx % 2 === 0 ? 'bg-bg-secondary' : 'bg-bg-section-alt'
                        }
                      >
                        {row.map((cell: string, cIdx: number) => (
                          <td 
                            key={cIdx} 
                            className={`px-4 py-3.5 font-sans text-text-body ${
                              isHeader ? 'font-bold text-text-h uppercase tracking-wider text-[10px]' : 'font-medium'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        // Render callout block
        if (block._type === 'callout') {
          const calloutStyles: Record<string, string> = {
            info: 'bg-blue-500/10 border-blue-500/20 text-blue-900',
            warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-900',
            success: 'bg-green-500/10 border-green-500/20 text-green-900',
            tip: 'bg-purple-500/10 border-purple-500/20 text-purple-900'
          };
          const currentStyle = calloutStyles[block.type] || calloutStyles.info;
          return (
            <div key={index} className={`my-6 p-4 rounded-xl border ${currentStyle} text-xs font-sans leading-relaxed`}>
              <div className="font-bold uppercase tracking-wider mb-1">{block.type || 'info'}</div>
              <div>{block.text}</div>
            </div>
          );
        }

        // Render socialEmbed block
        if (block._type === 'socialEmbed') {
          return (
            <div key={index} className="my-6 p-4 rounded-xl border border-border-primary bg-bg-secondary text-xs flex items-center justify-between">
              <div>
                <span className="font-bold uppercase tracking-wider text-text-h mr-2">{block.platform} Post</span>
                <span className="text-text-muted">{block.url}</span>
              </div>
              <a 
                href={block.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-3 py-1.5 rounded-lg border border-border-primary hover:border-link-hover text-[10px] uppercase font-bold text-text-h transition-colors"
              >
                View Link
              </a>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
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
