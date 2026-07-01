import Link from 'next/link';
import { client } from '@/lib/sanity';
import { getCachedHomepage, getCachedSiteSettings } from '@/lib/sanity';
import { latestContentQuery } from '@/lib/queries';
import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import Typography from "@/components/typography/Typography";
import Accordion from "@/components/ui/Accordion";
import ArticleCard from "@/components/cards/ArticleCard";
import TestimonialCard from "@/components/cards/TestimonialCard";
import CtaSection from "@/components/sections/CtaSection";

export const revalidate = 600; // Revalidate dynamic homepage content every 10 minutes

import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const homeData = await getCachedHomepage();
  const settings = await getCachedSiteSettings();
  if (!homeData && !settings) return {};

  const title = homeData?.seoTitle || settings?.defaultSeoTitle || "TheAskt — AI Career & Opportunity Platform";
  const description = homeData?.seoDescription || settings?.defaultSeoDescription || "Learn AI, Build Skills, Create Career Opportunities.";
  
  const robots = homeData?.noIndex
    ? { index: false, follow: false }
    : { index: true, follow: true };

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

function getFaqContent(content: any): string {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((block: any) => {
        if (block._type !== 'block' || !block.children) return '';
        return block.children.map((span: any) => span.text || '').join('');
      })
      .filter(Boolean)
      .join('\n\n');
  }
  return '';
}

export default async function Home() {
  // Fetch homepage and latest content from Sanity (cached — deduplicated with generateMetadata)
  const homeData = await getCachedHomepage();
  const latestContent = await client.fetch(latestContentQuery).catch(() => null);

  // Fallbacks for data to prevent rendering crashes if Sanity is empty
  const heroTitle = homeData?.heroTitle || "China could have the keys to your life savings";
  const heroSubtitle = homeData?.heroSubtitle || "A new threat is emerging from software vulnerabilities. Native codebases and open-source packages are targeted, putting digital assets at risk.";
  const heroCtaLink = homeData?.heroCtaLink || "/career-program";

  const posts = latestContent || [
    {
      _type: "article",
      title: "Building Workflows with Firebase Cloud Functions",
      slug: "firebase-cloud-functions-workflows",
      excerpt: "Learn how to hook Firestore writes directly into asynchronous notification pipelines without middle layers.",
      publishedAt: new Date().toISOString(),
      author: { name: "Sarah Jenkins" },
      categories: [{ name: "Automation", slug: "automation" }]
    },
    {
      _type: "article",
      title: "Introduction to Prompt Engineering",
      slug: "intro-prompt-engineering",
      excerpt: "An editorial primer on structured outputs, system directives, temperature variables, and prompt chains.",
      publishedAt: new Date().toISOString(),
      author: { name: "Aidan Vance" },
      categories: [{ name: "Prompt Engineering", slug: "prompt-engineering" }]
    },
    {
      _type: "article",
      title: "Essential API Integrations for AI Agents",
      slug: "essential-api-integrations",
      excerpt: "A collection of curated REST integrations and auth patterns for deploying autonomous systems.",
      publishedAt: new Date().toISOString(),
      author: { name: "Marcus Chen" },
      categories: [{ name: "AI Tools", slug: "ai-tools" }]
    },
    {
      _type: "article",
      title: "The Shift in Tech Recruiting for 2026",
      slug: "tech-recruiting-shift-2026",
      excerpt: "How companies are adopting portfolio-first screening over traditional algorithmic testing.",
      publishedAt: new Date().toISOString(),
      author: { name: "Elena Rostova" },
      categories: [{ name: "Career", slug: "career" }]
    }
  ];

  const leadStory = posts[0];
  const secondaryStories = posts.slice(1, 3);
  const opinionStories = posts.slice(3, 6);
  const trendingStories = posts.slice(0, 5);

  const testimonials = homeData?.testimonials || [
    {
      quote: "TheAskt transformed how I build. The portfolio work alone landed me an automation contract.",
      author: { name: "Elena Rostova", biography: "AI Automation Engineer" }
    },
    {
      quote: "Marcus Chen is a true expert. The design review workflows he sets up are outstanding.",
      author: { name: "Marcus Chen", biography: "Product Designer" }
    }
  ];

  const faqs = homeData?.faqs || [
    {
      title: "Is prior coding experience required?",
      content: "No. Our career path guides start from zero-knowledge prompting models, transitioning to API integrations and native builds."
    },
    {
      title: "How does the career matchmaking work?",
      content: "We track completed student portfolios and submit verified profiles directly to our hiring partners for contract or full-time roles."
    }
  ];

  /* ponytail: refactored homepage to utilize cards, accordion, section and container primitives */
  return (
    <Container className="py-12 space-y-16">
      
      {/* 3-Column Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-divider gap-8 lg:gap-0 pb-12">
        
        {/* Left Column: Opinion / Briefings (1/4 width) */}
        <div className="lg:pr-8 lg:col-span-1 space-y-8">
          <Typography variant="h4" className="border-b border-border-primary pb-2">Opinion & Analysis</Typography>
          {opinionStories.map((post: any, idx: number) => (
            <ArticleCard
              key={idx}
              variant="opinion"
              title={post.title}
              slug={post.slug}
              excerpt={post.excerpt}
              categoryName={post.categories?.[0]?.name || "OPINION"}
              authorName={post.author?.name || "Editor"}
            />
          ))}
          {opinionStories.length === 0 && (
            <Typography variant="small" className="italic">No opinions published yet.</Typography>
          )}
        </div>

        {/* Center Column: Lead Stories (2/4 width) */}
        <div className="lg:px-8 lg:col-span-2 space-y-8 pt-8 lg:pt-0">
          {leadStory && (
            <ArticleCard
              variant="lead"
              title={leadStory.title}
              slug={leadStory.slug}
              excerpt={leadStory.excerpt}
              coverImageUrl={leadStory.coverImageUrl}
              publishedAt={leadStory.publishedAt}
              authorName={leadStory.author?.name || "Editor"}
              categoryName={leadStory.categories?.[0]?.name || "LEAD STORY"}
            />
          )}

          {/* Grid of Secondary Stories */}
          <div className="grid gap-6 sm:grid-cols-2 pt-8 border-t border-border-primary">
            {secondaryStories.map((post: any, idx: number) => (
              <ArticleCard
                key={idx}
                variant="secondary"
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImageUrl={post.coverImageUrl}
                categoryName={post.categories?.[0]?.name || "GUIDE"}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Trending & Newsletter (1/4 width) */}
        <div className="lg:pl-8 lg:col-span-1 space-y-8 pt-8 lg:pt-0">
          <Typography variant="h4" className="border-b border-border-primary pb-2">Most Read</Typography>
          
          <div className="space-y-5">
            {trendingStories.map((post: any, idx: number) => (
              <ArticleCard
                key={idx}
                variant="trending"
                index={idx}
                title={post.title}
                slug={post.slug}
                authorName={post.author?.name || "Editor"}
                excerpt={post.excerpt}
              />
            ))}
          </div>

          {/* Newsletter Box */}
          <div className="p-5 border border-border-primary bg-bg-secondary space-y-3 rounded-xl">
            <Typography variant="h4">Newsletter</Typography>
            <Typography variant="small" className="leading-relaxed">Get our weekly brief on technical skills, recruiting reports, and platform tools.</Typography>
            <Link href="/newsletter" className="block text-center bg-btn-primary-bg hover:bg-btn-primary-hover text-btn-primary-text py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all active:scale-98">
              Subscribe Free
            </Link>
          </div>
        </div>
      </div>

      {/* Member Testimonials */}
      <Section divider className="space-y-8">
        <Typography variant="h2" className="text-center">Member Testimonials</Typography>
        <div className="grid gap-8 sm:grid-cols-2">
          {testimonials.map((test: any, idx: number) => (
            <TestimonialCard
              key={idx}
              quote={test.quote || test.excerpt}
              name={test.author?.name || "Member"}
              role={test.author?.biography || "Alumni"}
            />
          ))}
        </div>
      </Section>

      {/* FAQs */}
      <Section divider className="pb-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <Typography variant="h2" className="text-center">Frequently Asked Questions</Typography>
          <Accordion items={faqs.map((f: any) => ({ title: f.title, content: getFaqContent(f.content) }))} />
        </div>
      </Section>

      {/* CTA Section */}
      <CtaSection
        title="Ready to Advance?"
        description="Admissions for the AI Career Program™ are currently open. Book a free discovery session to get started."
        ctaText="Book Discovery Session"
        ctaLink="/book-session"
      />
    </Container>
  );
}
