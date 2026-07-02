"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NewsletterForm from '../forms/NewsletterForm';

interface FooterProps {
  settings?: {
    logoText?: string;
    copyrightText?: string;
    socialLinks?: Array<{
      platform: string;
      url: string;
    }>;
    footerLinks?: Array<{
      heading: string;
      links: Array<{
        label: string;
        url: string;
      }>;
    }>;
  } | null;
  categories?: Array<{
    name: string;
    slug: string;
  }>;
}

function getSocialIcon(platform: string) {
  switch (platform) {
    case 'twitter':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      );
    case 'github':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
      );
    case 'youtube':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className="h-4.5 w-4.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      );
    case 'facebook':
      return (
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer({ settings, categories = [] }: FooterProps) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) return null;

  const categoriesColumn = categories.length > 0 ? {
    heading: "Categories",
    links: categories.map((cat) => ({
      label: cat.name,
      url: `/learn/category/${cat.slug}`
    }))
  } : null;

  const rawColumns = settings?.footerLinks || [];

  const combinedColumns = [...rawColumns];
  if (categoriesColumn) {
    combinedColumns.push(categoriesColumn);
  }

  /* ponytail: dynamically extend Platform menu columns with PWA install links */
  const footerColumns = combinedColumns.map((col) => {
    if (col.heading === "Platform") {
      const hasInstall = col.links.some((l) => l.label === "Install App");
      if (!hasInstall) {
        return {
          ...col,
          links: [...col.links, { label: "Install App", url: "#install-app" }]
        };
      }
    }
    return col;
  });

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const prompt = (window as any).deferredAppInstallPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log(`PWA install choice from footer: ${outcome}`);
      if (outcome === "accepted") {
        (window as any).deferredAppInstallPrompt = null;
        window.dispatchEvent(new CustomEvent("pwa-installed"));
      }
    } else {
      alert("App installation is not supported by your current browser, or it has already been installed.\n\nOn iOS, you can install by tapping the 'Share' icon in Safari and selecting 'Add to Home Screen'.");
    }
  };

  return (
    <footer className="border-t border-border-primary bg-footer-bg text-footer-link py-16 transition-colors">
      <div className="mx-auto max-w-5xl px-6 grid gap-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Link href="/" className="font-serif text-lg font-bold tracking-tight text-footer-heading">
            {settings?.logoText || "TheAskt"}<span className="text-footer-hover font-sans font-light">.</span>
          </Link>
          <p className="text-sm leading-6 text-footer-link/85 max-w-xs font-sans">
            Learn AI, build skills, and craft career opportunities. Timeless design meets artificial intelligence.
          </p>
          {settings?.socialLinks && settings.socialLinks.length > 0 && (
            <div className="flex gap-4 pt-1 items-center">
              {settings.socialLinks.map((soc, sidx) => {
                const icon = getSocialIcon(soc.platform);
                if (!icon) return null;
                return (
                  <a
                    key={sidx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${soc.platform} profile`}
                    className="text-footer-link hover:text-footer-hover transition-colors p-1 transform hover:scale-105"
                  >
                    {icon}
                  </a>
                );
              })}
            </div>
          )}
          <div className="pt-2">
            <NewsletterForm
              heading="Weekly Newsletter"
              description="Get our weekly brief on technical skills, recruiting reports, and platform tools."
              buttonText="Join"
            />
          </div>
        </div>

        {footerColumns.map((col, idx) => (
          <div key={idx}>
            <h4 className="text-xs font-semibold text-footer-heading uppercase tracking-wider">{col.heading}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link, lidx) => {
                if (link.url === "#install-app") {
                  return (
                    <li key={lidx}>
                      <button
                        onClick={handleInstallClick}
                        suppressHydrationWarning
                        className="text-footer-link hover:text-footer-hover transition-colors text-left w-full cursor-pointer bg-transparent border-none p-0 text-sm font-sans"
                      >
                        {link.label}
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={lidx}>
                    <Link href={link.url} className="text-footer-link hover:text-footer-hover transition-colors">
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-5xl px-6 mt-12 pt-8 border-t border-border-primary/20 flex justify-between items-center text-xs text-footer-link/60">
        <p>&copy; {new Date().getFullYear()} {settings?.logoText || "TheAskt"}. {settings?.copyrightText || "All rights reserved."}</p>
        <Link href="/disclaimer" className="hover:text-footer-hover transition-colors">Disclaimer</Link>
      </div>
    </footer>
  );
}
