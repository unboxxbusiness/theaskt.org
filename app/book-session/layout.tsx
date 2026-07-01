import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Book an AI Career Advising Session | TheAskt",
  description: "Schedule a one-on-one session to discuss AI career paths, portfolios, skills guidance, and curriculum overview details.",
  alternates: {
    canonical: "/book-session",
  },
};

export default function BookSessionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
