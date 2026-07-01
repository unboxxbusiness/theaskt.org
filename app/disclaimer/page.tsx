import type { Metadata } from 'next';
import Link from 'next/link';
import PolicyLayout from "@/components/layout/PolicyLayout";

export const metadata: Metadata = {
  title: "Disclaimer — TheAskt",
  description: "Read the Disclaimer for TheAskt AI learning and career platform.",
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  /* ponytail: refactored disclaimer page to use the shared PolicyLayout template */
  return (
    <PolicyLayout title="Disclaimer" effectiveDate="June 30, 2026">
      <p>
        The information provided on <strong>TheAskt</strong> is for educational and informational purposes only. By using this website, you acknowledge and agree to the terms outlined in this Disclaimer.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Educational Purpose</h2>
      <p>
        TheAskt publishes articles, guides, resources, and educational content related to artificial intelligence, technology, business, and career development.
      </p>
      <p>
        Our content is intended to help readers learn and understand these topics. It should not be considered professional, legal, financial, investment, or employment advice.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">No Professional Advice</h2>
      <p>
        The information available on this website does not replace advice from qualified professionals.
      </p>
      <p>
        Before making important career, business, financial, legal, or technical decisions, you should consult an appropriate professional advisor.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Accuracy of Information</h2>
      <p>
        We strive to publish accurate, reliable, and up-to-date information. However, technology evolves quickly, and information may change over time.
      </p>
      <p>
        TheAskt does not guarantee that all content is complete, accurate, or free from errors.
      </p>
      <p>
        You should independently verify any information before relying on it.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">AI and Technology Content</h2>
      <p>
        Artificial intelligence tools, software, and technologies evolve rapidly.
      </p>
      <p>
        Features, pricing, capabilities, and availability of third-party AI tools mentioned on this website may change without notice.
      </p>
      <p>
        Always refer to the official documentation or website of the respective provider before making decisions.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Career and Learning Outcomes</h2>
      <p>
        Our educational content and AI Career Program™ are designed to help learners build practical knowledge and skills.
      </p>
      <p>
        However, we do not guarantee:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Employment</li>
        <li>Job placement</li>
        <li>Promotions</li>
        <li>Freelance projects</li>
        <li>Business growth</li>
        <li>Income increases</li>
        <li>Career outcomes</li>
      </ul>
      <p>
        Individual results depend on many factors, including effort, experience, skills, market conditions, and personal circumstances.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Third-Party Links</h2>
      <p>
        TheAskt may include links to third-party websites, products, services, videos, or resources for informational purposes.
      </p>
      <p>
        We do not control or endorse the content, accuracy, or availability of third-party websites and are not responsible for their practices or policies.
      </p>
      <p>
        Your use of third-party services is at your own discretion.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">External Tools and Products</h2>
      <p>
        References to AI tools, software, platforms, or services are provided for educational purposes only.
      </p>
      <p>
        Unless explicitly stated, TheAskt is not affiliated with or endorsed by the companies behind these products.
      </p>
      <p>
        Any trademarks, logos, or product names remain the property of their respective owners.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">User Responsibility</h2>
      <p>
        By using this website, you accept responsibility for your own decisions and actions.
      </p>
      <p>
        You are solely responsible for how you apply the information, recommendations, or resources provided on TheAskt.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, TheAskt shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-text-secondary">
        <li>Your use of this website.</li>
        <li>Reliance on any information published on the website.</li>
        <li>Errors or omissions in the content.</li>
        <li>Temporary website interruptions or technical issues.</li>
        <li>Use of third-party websites or services.</li>
      </ul>
      <p>
        Your use of this website is entirely at your own risk.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Changes to This Disclaimer</h2>
      <p>
        We may update this Disclaimer from time to time to reflect changes in our website, services, or legal requirements.
      </p>
      <p>
        Any updates will be published on this page with the revised effective date.
      </p>

      <h2 className="font-serif text-xl font-bold text-text-h pt-4">Contact Us</h2>
      <p>
        If you have any questions regarding this Disclaimer, please contact us through our <Link href="/contact" className="text-link hover:text-link-hover underline transition-colors">Contact</Link> page.
      </p>
    </PolicyLayout>
  );
}
