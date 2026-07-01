import { NextResponse } from 'next/server';
import { getFirestoreDocuments, sendFcmNotification } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (process.env.NODE_ENV === 'production' && !secret) {
      console.error("Critical Security Error: SANITY_WEBHOOK_SECRET is missing in production.");
      return NextResponse.json({ error: 'Configuration Error: Webhook secret is missing.' }, { status: 500 });
    }

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized: Invalid webhook secret token.' }, { status: 401 });
    }

    const body = await request.json();

    // Check if the webhook payload represents a published article or guide
    const { _type, title, slug, excerpt } = body;

    if (_type !== 'article' && _type !== 'guide') {
      return NextResponse.json({ message: 'Ignored document type: ' + _type }, { status: 200 });
    }

    // Retrieve all active push subscriber tokens from Firestore
    const subscribers = await getFirestoreDocuments('pushSubscribers');
    const tokens = subscribers
      .filter((sub) => sub.status === 'subscribed' && sub.token)
      .map((sub) => sub.token);

    if (tokens.length === 0) {
      return NextResponse.json({ message: 'No active push notification subscribers found.' }, { status: 200 });
    }

    // Extract the slug string format from Sanity schema reference or direct string
    const slugStr = slug?.current || slug || '';
    const clickUrl = `https://theaskt.com/learn/${slugStr}`;

    // Send FCM notification
    const result = await sendFcmNotification(
      tokens,
      `New Publication: ${title}`,
      excerpt || `Check out our latest ${_type} on TheAskt.`,
      clickUrl
    );

    return NextResponse.json({
      message: 'Notification triggered successfully.',
      recipientCount: tokens.length,
      result
    }, { status: 200 });

  } catch (error: any) {
    console.error('Sanity Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
