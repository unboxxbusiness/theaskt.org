import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

/**
 * Manual revalidation endpoint.
 * 
 * Call this to force-purge all cached pages instantly:
 *   GET https://theaskt.com/api/revalidate?secret=YOUR_SECRET
 * 
 * Or revalidate a specific path:
 *   GET https://theaskt.com/api/revalidate?secret=YOUR_SECRET&path=/learn/my-slug
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // Protect endpoint with secret
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  try {
    if (path) {
      // Revalidate a specific path
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path });
    }

    // Revalidate all pages
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/learn');

    return NextResponse.json({
      revalidated: true,
      message: 'All pages revalidated successfully. New articles will appear on next visit.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
