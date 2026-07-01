import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — TheAskt",
  description: "Read the Privacy Policy for TheAskt AI learning and career platform.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  /* ponytail: refactored privacy page to consume centralized PolicyLayout layout wrapper */
  return (
    <PolicyLayout title="Privacy Policy" effectiveDate="June 30, 2026">
      <p>
        At <strong>TheAskt</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data.
      </p>
      <p>
        By using TheAskt, you agree to the practices described in this Privacy Policy.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">1. Information We Collect</h2>
      <p>
        We may collect the following information when you interact with our website:
      </p>
      <h3 className="font-serif text-base font-bold text-text-h pt-2">Information You Provide</h3>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Phone Number (if provided)</li>
        <li>Messages submitted through contact forms</li>
        <li>Career session requests</li>
        <li>Brochure requests</li>
        <li>Newsletter subscriptions</li>
      </ul>
      <h3 className="font-serif text-base font-bold text-text-h pt-2">Automatically Collected Information</h3>
      <p>When you visit our website, we may automatically collect:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Browser type</li>
        <li>Device information</li>
        <li>IP address</li>
        <li>Pages visited</li>
        <li>Referring website</li>
        <li>Date and time of visit</li>
        <li>Basic analytics data</li>
      </ul>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">2. How We Use Your Information</h2>
      <p>We use your information to:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Respond to your enquiries</li>
        <li>Send newsletters (if you subscribe)</li>
        <li>Schedule career sessions</li>
        <li>Share program updates</li>
        <li>Improve our website and content</li>
        <li>Analyze website performance</li>
        <li>Provide customer support</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p>
        We only collect information that is necessary to provide and improve our services.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">3. Newsletter Communications</h2>
      <p>If you subscribe to our newsletter, we may send you:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>AI articles</li>
        <li>Learning resources</li>
        <li>Program announcements</li>
        <li>Event updates</li>
        <li>Career opportunities</li>
        <li>Product updates</li>
      </ul>
      <p>
        You can unsubscribe at any time using the unsubscribe link included in every email.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">4. Cookies</h2>
      <p>We may use cookies and similar technologies to:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Remember user preferences</li>
        <li>Improve website performance</li>
        <li>Measure website traffic</li>
        <li>Analyze visitor behavior</li>
      </ul>
      <p>
        You can disable cookies through your browser settings, although some features of the website may not function properly.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">5. Third-Party Services</h2>
      <p>
        We may use trusted third-party services to operate our website, including services for:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Website analytics</li>
        <li>Content management</li>
        <li>Form submissions</li>
        <li>Email communications</li>
        <li>Push notifications</li>
        <li>Cloud hosting</li>
      </ul>
      <p>
        These providers process information only as required to deliver their services and are responsible for protecting your data under their own privacy policies.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">6. Data Security</h2>
      <p>
        We use reasonable technical and organizational measures to help protect your personal information from unauthorized access, loss, misuse, or disclosure.
      </p>
      <p>
        While no online service can guarantee absolute security, we continuously work to safeguard the information we collect.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">7. Data Retention</h2>
      <p>We retain personal information only for as long as necessary to:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Provide our services</li>
        <li>Respond to enquiries</li>
        <li>Meet legal requirements</li>
        <li>Improve our platform</li>
      </ul>
      <p>
        When information is no longer required, it is securely deleted or anonymized where appropriate.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">8. Your Rights</h2>
      <p>Depending on your location and applicable laws, you may have the right to:</p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your data</li>
        <li>Withdraw consent for communications</li>
        <li>Unsubscribe from newsletters</li>
        <li>Request information about how your data is used</li>
      </ul>
      <p>
        To exercise any of these rights, please contact us through our <Link href="/contact" className="text-link hover:text-link-hover underline transition-colors">Contact</Link> page.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">9. Children's Privacy</h2>
      <p>
        TheAskt is not intended for children under the age required by applicable law to provide consent for online services.
      </p>
      <p>
        We do not knowingly collect personal information from children. If you believe a child has submitted personal information, please contact us so we can remove it.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">10. External Links</h2>
      <p>
        Our website may contain links to third-party websites and services.
      </p>
      <p>
        We are not responsible for the privacy practices or content of external websites. We encourage you to review their privacy policies before sharing personal information.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">11. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or business practices.
      </p>
      <p>
        Any updates will be published on this page with the revised effective date.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">12. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy or how your information is handled, please contact us through our <Link href="/contact" className="text-link hover:text-link-hover underline transition-colors">Contact</Link> page.
      </p>
    </PolicyLayout>
  );
}
