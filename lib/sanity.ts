import { createClient } from 'next-sanity';
import { cache } from 'react';
import { siteSettingsQuery, activeAnnouncementsQuery, homepageQuery, categoriesQuery } from './queries';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lg2rm1yc',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
});

export function getSanityImageUrl(source: any): string {
  if (!source) return '';

  if (typeof source === 'string') {
    return buildUrlFromRef(source);
  }

  if (source.url) {
    return source.url;
  }

  if (source.asset) {
    if (typeof source.asset === 'string') {
      return buildUrlFromRef(source.asset);
    }
    if (source.asset.url) {
      return source.asset.url;
    }
    if (source.asset._ref) {
      return buildUrlFromRef(source.asset._ref);
    }
  }

  if (source._ref) {
    return buildUrlFromRef(source._ref);
  }

  return '';
}

function buildUrlFromRef(ref: string): string {
  if (!ref) return '';
  
  const cleanRef = ref.startsWith('image-') ? ref.substring(6) : ref;
  const parts = cleanRef.split('-');
  if (parts.length < 3) return '';

  const extension = parts[parts.length - 1];
  const dimensions = parts[parts.length - 2];
  const assetId = parts.slice(0, parts.length - 2).join('-');

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lg2rm1yc';
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${extension}`;
}

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

export const getCachedCategories = cache(async () => {
  return client.fetch(categoriesQuery).catch(() => []);
});

