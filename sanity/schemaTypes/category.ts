import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: Rule => Rule.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({ name: 'seoTitle', title: 'SEO Title Override', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description Override', type: 'text', rows: 2 }),
    defineField({ name: 'noIndex', title: 'Exclude from Search Engine Indexing (noindex)', type: 'boolean', initialValue: false })
  ]
});
