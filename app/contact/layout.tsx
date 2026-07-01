import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with TheAskt Team",
  description: "Connect with TheAskt for support, feedback, partnerships, or general queries about our AI learning resources.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
