import type { Metadata } from 'next';
import { client } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';
import DownloadBrochureForm from '@/components/forms/DownloadBrochureForm';

export const revalidate = 600; // Revalidate static cache every 10 minutes

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(siteSettingsQuery).catch(() => null);
  const title = settings?.brochureTitle || "Download Curriculum Brochure";
  const desc = settings?.brochureDescription || "Download curriculum overview for AI Career Program™.";
  return {
    title: `${title} — TheAskt`,
    description: desc,
    alternates: {
      canonical: "/download-brochure",
    },
  };
}

export default async function DownloadBrochure() {
  const settings = await client.fetch(siteSettingsQuery).catch(() => null);

  return (
    <DownloadBrochureForm
      title={settings?.brochureTitle}
      description={settings?.brochureDescription}
      fileUrl={settings?.brochureFileUrl}
      successText={settings?.brochureSuccessText}
      buttonText={settings?.brochureButtonText}
    />
  );
}
