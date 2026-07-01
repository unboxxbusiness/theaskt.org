import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';
  
  // Fetch latest 50 posts for RSS Feed
  const posts = await client.fetch(`*[_type == "article" && defined(slug.current)] | order(publishedAt desc)[0...50]{
    title,
    "slug": slug.current,
    excerpt,
    publishedAt
  }`).catch(() => []);

  const itemsXml = posts.map((post: any) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/learn/${post.slug}</link>
      <guid>${baseUrl}/learn/${post.slug}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.publishedAt || Date.now()).toUTCString()}</pubDate>
    </item>
  `).join('');

  const feedXml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>TheAskt — AI Career & Learning Feed</title>
        <link>${baseUrl}</link>
        <description>Deep-dive tutorials, system guides, newsletters, and actionable resource repositories.</description>
        <language>en-us</language>
        ${itemsXml}
      </channel>
    </rss>
  `;

  return new NextResponse(feedXml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
