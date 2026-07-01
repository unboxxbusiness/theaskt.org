import { defineField, defineType } from 'sanity';

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'faqs', title: 'FAQ Settings' },
    { name: 'testimonials', title: 'Testimonial Settings' },
    { name: 'seo', title: 'SEO Panel' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Homepage Settings',
      readOnly: true,
    }),

    // --- Hero Section ---
    defineField({
      name: 'heroTitle',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      description: 'Main headline shown in the hero section. Leave blank to use the hardcoded default.'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Supporting sentence below the headline.'
    }),
    defineField({
      name: 'heroCtaText',
      title: 'Hero CTA Button Text',
      type: 'string',
      group: 'hero',
      initialValue: 'Explore Career Program'
    }),
    defineField({
      name: 'heroCtaLink',
      title: 'Hero CTA Button Link',
      type: 'string',
      group: 'hero',
      initialValue: '/career-program'
    }),

    // --- FAQ Section ---
    defineField({
      name: 'faqSectionTitle',
      title: 'FAQ Section Title',
      type: 'string',
      initialValue: 'Frequently Asked Questions',
      group: 'faqs'
    }),
    defineField({
      name: 'faqs',
      title: 'Selected FAQs',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'faq' }] }],
      group: 'faqs'
    }),

    // --- Testimonials Section ---
    defineField({
      name: 'testimonialSectionTitle',
      title: 'Testimonials Section Title',
      type: 'string',
      initialValue: 'Member Stories',
      group: 'testimonials'
    }),
    defineField({
      name: 'testimonials',
      title: 'Selected Testimonials',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'testimonial' }] }],
      group: 'testimonials'
    }),

    // --- SEO Panel (Optional per-page overrides) ---
    defineField({ 
      name: 'seoTitle', 
      title: 'Homepage SEO Title (Override)', 
      type: 'string',
      description: 'Optional. Overrides the global default SEO title only for the homepage. Leave blank to use the global default from Site & Layout Settings → SEO tab.',
      group: 'seo'
    }),
    defineField({ 
      name: 'seoDescription', 
      title: 'Homepage SEO Description (Override)', 
      type: 'text', 
      rows: 2,
      description: 'Optional. Overrides the global default SEO description only for the homepage. Leave blank to use the global default.',
      group: 'seo'
    }),
    defineField({ 
      name: 'noIndex', 
      title: 'Hide homepage from search engines (noindex)', 
      type: 'boolean', 
      initialValue: false,
      description: 'Enable this only if you do NOT want the homepage to appear in Google search results.',
      group: 'seo'
    })
  ]
});


