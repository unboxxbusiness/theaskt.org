import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import NewsletterForm from '@/components/forms/NewsletterForm';

export const metadata: Metadata = {
  title: "Subscribe to the TheAskt Chronicle | Weekly AI Career Newsletter",
  description: "Join thousands of AI professionals receiving technical blueprints, career matching briefs, and platform updates weekly from TheAskt.",
  alternates: {
    canonical: "/newsletter",
  },
};


export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 space-y-8 animate-fade-in bg-bg-primary text-text-body min-h-[50vh] flex flex-col justify-center transition-colors">
      <div className="space-y-4 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-link transition-colors mb-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-wider text-link font-sans block">Weekly Publication</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-text-h leading-tight">TheAskt Chronicle</h1>
        <p className="text-xs text-text-secondary max-w-sm mx-auto leading-5">
          Join thousands of AI professionals receiving technical blueprints, career matching briefs, and platform updates weekly.
        </p>
      </div>

      <div className="border border-border-primary p-2 bg-bg-secondary rounded-2xl">
        <NewsletterForm
          heading="Get Core Blueprints"
          description="Enter your email to join our weekly publication list. No spam. Unsubscribe anytime in one click."
          buttonText="Subscribe Now"
          layout="card"
        />
      </div>

      <p className="text-[10px] text-center text-text-muted leading-relaxed max-w-xs mx-auto">
        By subscribing, you agree to our Terms of Use and Privacy Policy. Subscriptions map directly to our secure Firestore REST instance.
      </p>
    </div>
  );
}
