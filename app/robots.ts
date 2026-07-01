import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';
  
  /* ponytail: dynamically compiled robots configurations routing public search crawlers */
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
