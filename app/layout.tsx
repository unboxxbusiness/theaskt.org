import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FcmInitializer from "@/components/shared/FcmInitializer";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import { ThemeProvider } from "@/components/theme-provider";
import AnnouncementBar from "@/components/navigation/AnnouncementBar";
import SwRegister from "@/components/shared/SwRegister";
import InstallBanner from "@/components/shared/InstallBanner";
import VersionNotification from "@/components/shared/VersionNotification";
import FocusModeOverlay from "@/components/shared/FocusModeOverlay";
import Analytics from "@/components/shared/Analytics";
import { getCachedSiteSettings, getCachedAnnouncements } from "@/lib/sanity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: settings?.defaultSeoTitle || "TheAskt — AI Career & Opportunity Platform",
      template: "%s | TheAskt",
    },
    description: settings?.defaultSeoDescription || "Learn AI, Build Skills, Create Career Opportunities.",
    manifest: "/manifest.json",
    // No global canonical — each page must set its own
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: settings?.defaultSeoTitle || "TheAskt — AI Career & Opportunity Platform",
      description: settings?.defaultSeoDescription || "Learn AI, Build Skills, Create Career Opportunities.",
      url: baseUrl,
      siteName: "TheAskt",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.defaultSeoTitle || "TheAskt — AI Career & Opportunity Platform",
      description: settings?.defaultSeoDescription || "Learn AI, Build Skills, Create Career Opportunities.",
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: "TheAskt",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#14213D",
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": `${baseUrl}/#organization`,
  "name": "TheAskt",
  "url": baseUrl,
  "logo": `${baseUrl}/logo.png`,
  "sameAs": [
    "https://twitter.com/theaskt",
    "https://github.com/theaskt",
    "https://linkedin.com/company/theaskt"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${baseUrl}/#website`,
  "name": "TheAskt",
  "url": baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${baseUrl}/learn?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getCachedSiteSettings();
  const announcements = await getCachedAnnouncements();
  const activeAnnouncement = announcements?.[0];

  /* ponytail: structured announcement, navbar, main viewport and footer wrapper */
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg-primary text-text-body font-sans transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableTheme
          enableSystem
          disableTransitionOnChange
        >
          <SwRegister />
          <VersionNotification />
          <FocusModeOverlay />
          <Analytics />
          {/* Server-rendered JSON-LD: visible to crawlers without JS execution */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([orgSchema, websiteSchema]) }}
          />
          <AnnouncementBar announcement={activeAnnouncement} />
          <Navbar settings={settings} />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer settings={settings} />
          <NewsletterPopup />
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-4 items-end">
            <FcmInitializer />
            <InstallBanner />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
