import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';
import { getFirestoreDocuments, sendFcmNotification } from '@/lib/firebase';

const secret = process.env.SANITY_WEBHOOK_SECRET || "";

export async function POST(request: Request) {
  try {
    const signature = request.headers.get(SIGNATURE_HEADER_NAME) || "";
    const rawBody = await request.text();

    // Verify Sanity signature to ensure authentic origin
    const valid = await isValidSignature(rawBody, signature, secret);
    if (!valid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);

    // Check if the webhook payload represents a published article or guide
    const { _type, title, slug, excerpt } = body;

    // ── Revalidate cached pages so new content appears instantly ──
    revalidatePath('/', 'layout');       // Purge everything under root layout
    revalidatePath('/');                 // Homepage
    revalidatePath('/learn');            // Learn listing page

    const slugStr = slug?.current || slug || '';
    if (slugStr) {
      revalidatePath(`/learn/${slugStr}`);  // The specific article page
    }

    if (_type !== 'article' && _type !== 'guide') {
      return NextResponse.json({ message: `Cache revalidated. Ignored notification for type: ${_type}` }, { status: 200 });
    }

    // Retrieve all active push subscriber tokens from Firestore
    const subscribers = await getFirestoreDocuments('pushSubscribers');
    const tokens = subscribers
      .filter((sub) => sub.status === 'subscribed' && sub.token)
      .map((sub) => sub.token);

    if (tokens.length === 0) {
      return NextResponse.json({ message: 'Cache revalidated. No active push notification subscribers found.' }, { status: 200 });
    }

    // Extract the slug string format from Sanity schema reference or direct string
    const clickUrl = `https://theaskt.com/learn/${slugStr}`;

    // Send FCM notification
    const result = await sendFcmNotification(
      tokens,
      `New Publication: ${title}`,
      excerpt || `Check out our latest ${_type} on TheAskt.`,
      clickUrl
    );

    return NextResponse.json({
      message: 'Cache revalidated and notification triggered successfully.',
      recipientCount: tokens.length,
      result
    }, { status: 200 });

  } catch (error: any) {
    console.error('Sanity Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
