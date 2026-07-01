import { defineField, defineType } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: Rule => Rule.required() }),
    defineField({ name: 'biography', title: 'Biography', type: 'text', rows: 3 }),
    defineField({ name: 'avatar', title: 'Avatar Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'socials',
      title: 'Social Links',
      type: 'object',
      fields: [
        { name: 'twitter', title: 'Twitter', type: 'string' },
        { name: 'github', title: 'GitHub', type: 'string' },
        { name: 'linkedin', title: 'LinkedIn', type: 'string' }
      ]
    }),
    defineField({ name: 'seoTitle', title: 'SEO Title Override', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description Override', type: 'text', rows: 2 }),
    defineField({ name: 'noIndex', title: 'Exclude from Search Engine Indexing (noindex)', type: 'boolean', initialValue: false })
  ]
});
