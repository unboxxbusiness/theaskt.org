import { NextResponse } from 'next/server';
import { client } from '@/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const searchTerm = `*${query}*`;
    const groqQuery = `*[_type == "article" && title match $searchTerm && defined(slug.current)][0...10]{
      _type,
      title,
      "slug": slug.current
    }`;

    // Fetch matching data from Sanity CDN
    const rawResults = await client.fetch(groqQuery, { searchTerm }).catch(() => []);
    
    // Return JSON results with CDN edge-caching control headers
    return NextResponse.json(rawResults, {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error("Server-side search API error:", error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
