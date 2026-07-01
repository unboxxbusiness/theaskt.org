import type { Metadata } from 'next';
import BookSessionForm from '@/components/forms/BookSessionForm';

export const metadata: Metadata = {
  title: "Book a Free Career Session | AI Career Guidance | TheAskt",
  description: "Book a free one-on-one career session with TheAskt to discuss your AI career goals, explore the AI Career Program, and get personalized guidance. Online and in-person options available.",
  alternates: {
    canonical: "/book-session",
  },
  openGraph: {
    title: "Book a Free Career Session | TheAskt",
    description: "Book a free one-on-one career session with TheAskt. Get personalized AI career guidance and discover if our AI Career Program is right for you.",
    type: "website",
  },
};

const bookSessionSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Free AI Career Guidance Session",
  "description": "A complimentary one-on-one career session designed to help you explore AI career opportunities and learning paths.",
  "provider": {
    "@type": "EducationalOrganization",
    "name": "TheAskt",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "https://theaskt.com"
  },
  "areaServed": "Worldwide",
  "isAccessibleForFree": true,
  "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com'}/book-session`,
};

export default function BookSessionPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSessionSchema) }}
      />
      <BookSessionForm />
    </>
  );
}
