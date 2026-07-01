import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of Use — TheAskt",
  description: "Read the Terms of Use for TheAskt AI learning and career platform.",
  alternates: {
    canonical: "/terms-of-use",
  },
};

export default function TermsOfUsePage() {
  /* ponytail: refactored legal document to use reusable PolicyLayout template wrapper */
  return (
    <PolicyLayout title="Terms of Use" effectiveDate="June 30, 2026">
      <p>
        Welcome to <strong>TheAskt</strong>. By accessing or using our website, you agree to these Terms of Use. Please read them carefully before using our website, services, or educational resources.
      </p>
      <p>
        If you do not agree with these terms, please discontinue use of the website.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">1. About TheAskt</h2>
      <p>
        TheAskt is an AI learning and career platform that provides educational content, practical resources, and career-focused programs designed to help individuals learn AI, build practical skills, and create better career opportunities.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">2. Acceptance of These Terms</h2>
      <p>
        By using TheAskt, you confirm that you have read, understood, and agreed to these Terms of Use and our Privacy Policy.
      </p>
      <p>
        These terms apply to all visitors, users, subscribers, and anyone accessing our website.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">3. Use of the Website</h2>
      <p>
        You agree to use this website only for lawful purposes.
      </p>
      <p>You must not:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Violate any applicable laws or regulations.</li>
        <li>Attempt to gain unauthorized access to our systems or services.</li>
        <li>Disrupt, damage, or interfere with the operation of the website.</li>
        <li>Copy, reproduce, or distribute our content without permission.</li>
        <li>Use the website for fraudulent, abusive, or harmful activities.</li>
      </ul>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">4. Educational Content</h2>
      <p>
        All content published on TheAskt is provided for educational and informational purposes only.
      </p>
      <p>
        While we strive to keep our content accurate and up to date, we do not guarantee that all information will always be complete, accurate, or suitable for every situation.
      </p>
      <p>
        You are responsible for evaluating and applying any information provided on this website.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">5. AI Career Program™</h2>
      <p>
        Information about our AI Career Program™, curriculum, schedules, pricing, certifications, and services may change from time to time.
      </p>
      <p>
        Enrollment in any program may be subject to additional terms, eligibility requirements, and policies.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">6. Intellectual Property</h2>
      <p>
        Unless otherwise stated, all content on TheAskt—including articles, text, graphics, illustrations, logos, branding, designs, and educational materials—is owned by TheAskt or licensed to us.
      </p>
      <p>You may:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Read and share our content through direct links.</li>
        <li>Reference our content with proper attribution.</li>
      </ul>
      <p>You may not:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Copy or republish our content without permission.</li>
        <li>Sell or commercially distribute our materials.</li>
        <li>Modify or create derivative works from our content without authorization.</li>
      </ul>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">7. User Submissions</h2>
      <p>
        If you submit information through contact forms, newsletter subscriptions, career session bookings, or other forms, you confirm that the information provided is accurate and belongs to you.
      </p>
      <p>
        You are responsible for the content you submit.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">8. Third-Party Services</h2>
      <p>
        Our website may contain links to third-party websites, tools, videos, or services for your convenience.
      </p>
      <p>
        TheAskt is not responsible for the content, availability, or privacy practices of third-party websites.
      </p>
      <p>
        Your use of third-party services is governed by their own terms and policies.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">9. Privacy</h2>
      <p>
        Your use of TheAskt is also governed by our <Link href="/privacy-policy" className="text-link hover:text-link-hover underline transition-colors">Privacy Policy</Link>, which explains how we collect, use, and protect your information.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by applicable law, TheAskt shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of this website or reliance on its content.
      </p>
      <p>
        Your use of the website is at your own risk.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">11. Changes to These Terms</h2>
      <p>
        We may update these Terms of Use from time to time to reflect changes in our website, services, or legal requirements.
      </p>
      <p>
        The updated version will always be published on this page with the revised effective date.
      </p>
      <p>
        Your continued use of the website after changes are posted constitutes acceptance of the updated terms.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">12. Contact Us</h2>
      <p>
        If you have any questions about these Terms of Use, please contact us through our <Link href="/contact" className="text-link hover:text-link-hover underline transition-colors">Contact</Link> page.
      </p>
    </PolicyLayout>
  );
}
