// GROQ queries for fetching Sanity CMS data in TheAskt editorial platform

// 1. Site Layout & Settings (Navigation, Footer, SEO defaults)
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteName,
  logoText,
  headerMenu[]{
    label,
    url,
    childLinks[]{
      label,
      url
    }
  },
  footerLinks[]{
    heading,
    links[]{
      label,
      url
    }
  },
  copyrightText,
  "brochureFileUrl": brochureFile.asset->url,
  defaultSeoTitle,
  defaultSeoDescription,
  "fallbackShareImageUrl": fallbackShareImage.asset->url,
  socialLinks[]{
    platform,
    url
  }
}`;

// 2. Homepage dynamic fields
export const homepageQuery = `*[_type == "homepage"][0]{
  heroTitle,
  heroSubtitle,
  heroCtaText,
  heroCtaLink,
  seoTitle,
  seoDescription,
  noIndex,
  careerProgramTitle,
  careerProgramDesc,
  careerProgramFeatures[]{
    title,
    desc
  },
  faqSectionTitle,
  faqs[]->{
    title,
    content
  },
  testimonialSectionTitle,
  testimonials[]->{
    "quote": quote,
    "author": {
      "name": title,
      "biography": designation
    }
  }
}`;

// 3. Main Learn Hub Stream
export const latestContentQuery = `*[_type == "article" && defined(slug.current) && (status == "published" || !defined(status))] | order(publishedAt desc)[0...20]{
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  isBreaking,
  isLatest,
  isFeatured,
  isSponsored,
  "coverImageUrl": coverImage.asset->url,
  author->{
    name,
    "avatarUrl": avatar.asset->url
  },
  categories[]->{
    name,
    "slug": slug.current
  },
  tags[]->{
    name,
    "slug": slug.current
  }
}`;

// 4. Content Detail (by slug)
export const contentDetailQuery = `*[_type == "article" && slug.current == $slug && (status == "published" || !defined(status))][0]{
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  content,
  readTime,
  relatedArticles[]->{
    title,
    "slug": slug.current,
    excerpt
  },
  seoTitle,
  seoDescription,
  canonicalUrl,
  noIndex,
  "ogImageUrl": ogImage.asset->url,
  showNewsletter,
  sources[]{
    title,
    url
  },
  "coverImageUrl": coverImage.asset->url,
  author->{
    name,
    biography,
    "slug": slug.current,
    "avatarUrl": avatar.asset->url,
    socials
  },
  categories[]->{
    _id,
    name,
    "slug": slug.current
  },
  tags[]->{
    name,
    "slug": slug.current
  }
}`;

// 5. Category page query
export const categoryQuery = `*[_type == "category" && slug.current == $slug][0]{
  name,
  description,
  "slug": slug.current,
  "contents": *[_type == "article" && references(^._id)] | order(publishedAt desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    author->{ name }
  }
}`;

// 6. Tag archive page query
export const tagQuery = `*[_type == "tag" && slug.current == $slug][0]{
  name,
  "slug": slug.current,
  "contents": *[_type == "article" && references(^._id)] | order(publishedAt desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "coverImageUrl": coverImage.asset->url,
    author->{ name }
  }
}`;

// 7. Author archive query
export const authorQuery = `*[_type == "author" && slug.current == $slug][0]{
  name,
  biography,
  "slug": slug.current,
  "avatarUrl": avatar.asset->url,
  socials,
  "contents": *[_type == "article" && references(^._id)] | order(publishedAt desc){
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "coverImageUrl": coverImage.asset->url
  }
}`;

// 8. Dynamic Active Announcements
export const activeAnnouncementsQuery = `*[_type == "announcement" && active == true] | order(_createdAt desc){
  title,
  description,
  ctaText,
  ctaLink,
  bgColor,
  gradientEndColor,
  countdownTarget
}`;

// 9. Categories list query
export const categoriesQuery = `*[_type == "category" && defined(slug.current)]{
  name,
  "slug": slug.current
}`;

