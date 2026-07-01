import Link from 'next/link';
import { ArrowLeft, Twitter, Github, Linkedin } from 'lucide-react';
import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { authorQuery } from '@/lib/queries';
import Image from 'next/image';

export const revalidate = 600; // Revalidate dynamic routes every 10 minutes

interface AuthorProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const authors = await client.fetch(
    `*[_type == "author" && defined(slug.current)]{ "slug": slug.current }`
  ).catch(() => []);
  return authors.map((auth: { slug: string }) => ({
    slug: auth.slug,
  }));
}

export async function generateMetadata({ params }: AuthorProps): Promise<Metadata> {
  const { slug } = await params;
  const authorData = await client.fetch(authorQuery, { slug }).catch(() => null);
  const name = authorData?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `Articles by ${name} — TheAskt`,
    description: authorData?.biography || `Browse all publication pieces and guides written by ${name} on TheAskt.`,
    alternates: {
      canonical: `/learn/author/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: AuthorProps) {
  const { slug } = await params;
  
  // Fetch author details and related content items from Sanity
  const authorData = await client.fetch(authorQuery, { slug }).catch(() => null);

  const name = authorData?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const biography = authorData?.biography || `Senior contributor at TheAskt publishing analytical insights on AI and technical workflows.`;
  const contents = authorData?.contents || [];
  const avatarUrl = authorData?.avatarUrl;
  const socials = authorData?.socials;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';
  const authorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": "Author",
    "worksFor": {
      "@type": "Organization",
      "name": "TheAskt"
    },
    "description": biography,
    "image": avatarUrl,
    "url": `${baseUrl}/learn/author/${slug}`,
    "sameAs": [
      socials?.twitter ? (socials.twitter.startsWith('http') ? socials.twitter : `https://twitter.com/${socials.twitter}`) : null,
      socials?.github ? (socials.github.startsWith('http') ? socials.github : `https://github.com/${socials.github}`) : null,
      socials?.linkedin ? (socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`) : null,
    ].filter(Boolean)
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-20 space-y-12 animate-fade-in bg-bg-primary text-text-body transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
      />
      <header className="space-y-6">
        <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-link transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Learn Hub
        </Link>
        
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {avatarUrl ? (
            <div className="relative h-20 w-20 rounded-full overflow-hidden border border-border-primary flex-shrink-0">
              <Image src={avatarUrl} alt={name} fill className="object-cover" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-full bg-bg-secondary flex-shrink-0" />
          )}
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-link">Author Profile</span>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-text-h">{name}</h1>
            <p className="text-sm text-text-secondary leading-6 max-w-2xl">{biography}</p>
            
            {/* Social links */}
            {(socials?.twitter || socials?.github || socials?.linkedin) && (
              <div className="flex gap-4 pt-1 text-text-muted">
                {socials.twitter && (
                  <a href={socials.twitter.startsWith('http') ? socials.twitter : `https://twitter.com/${socials.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-link transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {socials.github && (
                  <a href={socials.github.startsWith('http') ? socials.github : `https://github.com/${socials.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-link transition-colors">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin.startsWith('http') ? socials.linkedin : `https://linkedin.com/in/${socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-link transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <hr className="border-border-primary" />

      {/* Published content by this Author */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl font-bold text-text-h">Published Articles ({contents.length})</h2>
        {contents.length > 0 ? (
          <div className="divide-y divide-divider">
            {contents.map((item: any, idx: number) => (
              <article key={idx} className="py-6 first:pt-0 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-wider">
                  <span className="font-bold text-link capitalize">{item._type}</span>
                  <span>•</span>
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Recently"}</span>
                </div>
                <Link href={`/learn/${item.slug}`} className="block group">
                  <h3 className="font-serif text-lg font-bold text-text-h group-hover:text-link-hover transition-colors">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-xs text-text-secondary line-clamp-2 max-w-3xl leading-relaxed">{item.excerpt}</p>
                <div className="pt-1">
                  <Link href={`/learn/${item.slug}`} className="text-xs font-semibold text-link hover:text-link-hover transition-colors underline underline-offset-4">
                    Read Article &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-text-muted text-sm">
            No articles published by this author yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
