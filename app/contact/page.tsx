import type { Metadata } from 'next';
import ContactForm from '@/components/forms/ContactForm';

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch with TheAskt",
  description: "Have a question about TheAskt or our AI Career Program™? Contact our team for admissions, partnerships, career guidance, or general enquiries. We reply within 1–2 business days.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | TheAskt",
    description: "Have a question about TheAskt or our AI Career Program™? Contact our team for admissions, partnerships, career guidance, or general enquiries.",
    type: "website",
  },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact TheAskt",
  "description": "Contact TheAskt for AI Career Program enquiries, admissions, partnerships, and career guidance.",
  "url": `${process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com'}/contact`,
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactForm />
    </>
  );
}
