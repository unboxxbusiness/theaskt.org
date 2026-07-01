import { createClient } from 'next-sanity';
import { cache } from 'react';
import { siteSettingsQuery, activeAnnouncementsQuery, homepageQuery } from './queries';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

/**
 * React.cache wrappers for server-side data that is fetched in both generateMetadata()
 * and the page component. React.cache deduplicates calls within the same request.
 */
export const getCachedSiteSettings = cache(async () => {
  return client.fetch(siteSettingsQuery).catch(() => null);
});

export const getCachedAnnouncements = cache(async () => {
  return client.fetch(activeAnnouncementsQuery).catch(() => null);
});

export const getCachedHomepage = cache(async () => {
  return client.fetch(homepageQuery).catch(() => null);
});

