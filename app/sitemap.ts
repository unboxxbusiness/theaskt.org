import { MetadataRoute } from 'next';
import { client } from '@/lib/sanity';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';

  // Fetch all dynamic slugs from Sanity in parallel
  const [posts, categories, tags, authors] = await Promise.all([
    client.fetch(`*[_type == "article" && defined(slug.current) && (status == "published" || !defined(status))]{ "slug": slug.current, publishedAt }`).catch(() => []),
    client.fetch(`*[_type == "category" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`).catch(() => []),
    client.fetch(`*[_type == "tag" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`).catch(() => []),
    client.fetch(`*[_type == "author" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`).catch(() => []),
  ]);

  const articleUrls = posts.map((post: any) => ({
    url: `${baseUrl}/learn/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryUrls = categories.map((cat: any) => ({
    url: `${baseUrl}/learn/category/${cat.slug}`,
    lastModified: cat._updatedAt ? new Date(cat._updatedAt) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const tagUrls = tags.map((tag: any) => ({
    url: `${baseUrl}/learn/tag/${tag.slug}`,
    lastModified: tag._updatedAt ? new Date(tag._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const authorUrls = authors.map((auth: any) => ({
    url: `${baseUrl}/learn/author/${auth.slug}`,
    lastModified: auth._updatedAt ? new Date(auth._updatedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  const staticUrls = [
    { route: '', priority: 1.0, freq: 'daily' as const },
    { route: '/learn', priority: 0.9, freq: 'daily' as const },
    { route: '/career-program', priority: 0.9, freq: 'weekly' as const },
    { route: '/about', priority: 0.7, freq: 'monthly' as const },
    { route: '/contact', priority: 0.7, freq: 'monthly' as const },
    { route: '/book-session', priority: 0.8, freq: 'weekly' as const },
    { route: '/newsletter', priority: 0.6, freq: 'monthly' as const },
    { route: '/privacy-policy', priority: 0.3, freq: 'yearly' as const },
    { route: '/terms-of-use', priority: 0.3, freq: 'yearly' as const },
    { route: '/disclaimer', priority: 0.3, freq: 'yearly' as const },
  ].map(({ route, priority, freq }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: freq,
    priority,
  }));

  return [...staticUrls, ...articleUrls, ...categoryUrls, ...tagUrls, ...authorUrls];
}
