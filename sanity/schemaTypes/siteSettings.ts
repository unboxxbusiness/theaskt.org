import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site & Layout Settings',
  type: 'document',
  groups: [
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'brochure', title: 'Brochure PDF' },
    { name: 'social', title: 'Social Links' },
    { name: 'seo', title: 'SEO & Social Defaults' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Global Settings',
      readOnly: true,
    }),
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      initialValue: 'TheAskt',
      validation: Rule => Rule.required(),
      group: 'navigation'
    }),
    defineField({
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
      initialValue: 'TheAskt',
      group: 'navigation'
    }),
    defineField({
      name: 'headerMenu',
      title: 'Header Navigation Menu',
      type: 'array',
      group: 'navigation',
      options: { modal: { type: 'dialog' } },
      of: [
        {
          type: 'object',
          name: 'menuItem',
          title: 'Menu Item',
          fields: [
            { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
            { name: 'url', title: 'URL Link', type: 'string', validation: Rule => Rule.required() },
            {
              name: 'childLinks',
              title: 'Submenu Links (Nested Menu)',
              type: 'array',
              options: { modal: { type: 'dialog' } },
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
                    { name: 'url', title: 'URL Link', type: 'string', validation: Rule => Rule.required() }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Columns',
      type: 'array',
      group: 'footer',
      options: { modal: { type: 'dialog' } },
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Column Heading', type: 'string', validation: Rule => Rule.required() },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              options: { modal: { type: 'dialog' } },
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Label', type: 'string', validation: Rule => Rule.required() },
                    { name: 'url', title: 'URL Link', type: 'string', validation: Rule => Rule.required() }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'copyrightText',
      title: 'Footer Copyright Notice',
      type: 'string',
      initialValue: 'All rights reserved.',
      group: 'footer'
    }),
    defineField({
      name: 'brochureFile',
      title: 'Brochure PDF File',
      type: 'file',
      options: { accept: '.pdf' },
      group: 'brochure'
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'array',
      group: 'social',
      options: { modal: { type: 'dialog' } },
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'X / Twitter', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'GitHub', value: 'github' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' }
                ]
              },
              validation: Rule => Rule.required()
            },
            {
              name: 'url',
              title: 'Profile URL',
              type: 'url',
              validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] })
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      group: 'seo'
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 3,
      group: 'seo'
    }),
    defineField({
      name: 'fallbackShareImage',
      title: 'Fallback Social Share Image',
      type: 'image',
      options: { hotspot: true },
      group: 'seo'
    })
  ]
});
