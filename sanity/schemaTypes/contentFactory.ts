import { defineField, defineType } from 'sanity';

export function createContentSchema(name: string, title: string) {
  return defineType({
    name,
    title,
    type: 'document',
    groups: [
      { name: 'content', title: 'Content', default: true },
      { name: 'seo', title: 'SEO Panel' },
    ],
    fields: [
      // 1. Content Group
      defineField({ 
        name: 'title', 
        title: 'Title', 
        type: 'string', 
        group: 'content',
        validation: Rule => Rule.required().error('Title is required to publish.') 
      }),
      defineField({ 
        name: 'slug', 
        title: 'Slug', 
        type: 'slug', 
        group: 'content',
        options: { source: 'title', maxLength: 96 }, 
        validation: Rule => Rule.required().error('Slug is required to publish.') 
      }),
      defineField({ 
        name: 'publishedAt', 
        title: 'Published At', 
        type: 'datetime',
        group: 'content' 
      }),
      defineField({ 
        name: 'author', 
        title: 'Author', 
        type: 'reference', 
        to: [{ type: 'author' }],
        group: 'content',
        validation: Rule => Rule.warning('Author is recommended for editorial attribution.')
      }),
      defineField({ 
        name: 'categories', 
        title: 'Categories', 
        type: 'array', 
        of: [{ type: 'reference', to: [{ type: 'category' }] }],
        group: 'content',
        validation: Rule => Rule.warning('At least one Category is recommended for grouping.')
      }),
      defineField({ 
        name: 'tags', 
        title: 'Tags', 
        type: 'array', 
        of: [{ type: 'reference', to: [{ type: 'tag' }] }],
        group: 'content'
      }),
      defineField({ 
        name: 'excerpt', 
        title: 'Excerpt', 
        type: 'text', 
        rows: 3,
        group: 'content' 
      }),
      defineField({ 
        name: 'coverImage', 
        title: 'Featured / Cover Image', 
        type: 'image', 
        options: { hotspot: true },
        group: 'content',
        validation: Rule => Rule.warning('Featured / Cover image is highly recommended for visual layouts.')
      }),
      defineField({ 
        name: 'content', 
        title: 'Rich Content', 
        type: 'array', 
        group: 'content',
        options: {
          modal: {
            type: 'dialog'
          }
        },
        of: [
          { type: 'block' },
          { 
            type: 'image', 
            options: { hotspot: true },
            fields: [
              { 
                name: 'alt', 
                type: 'string', 
                title: 'Alternative Text', 
                validation: Rule => Rule.warning('Alternative text is recommended for accessibility compliance.') 
              },
              { name: 'caption', type: 'string', title: 'Caption' },
              {
                name: 'href',
                type: 'url',
                title: 'Image Link (Redirect URL)',
                description: 'Optional. Add a link to make the image clickable in the article post.'
              }
            ]
          },
          {
            name: 'pullQuote',
            type: 'object',
            title: 'Pull Quote',
            fields: [
              { 
                name: 'quote', 
                type: 'text', 
                title: 'Quote', 
                rows: 2, 
                validation: Rule => Rule.warning('Quote content should not be blank.') 
              },
              { name: 'attribution', type: 'string', title: 'Attribution' }
            ],
            preview: {
              select: {
                quote: 'quote',
                attribution: 'attribution'
              },
              prepare({ quote, attribution }) {
                return {
                  title: quote ? `“${quote}”` : 'Empty Pull Quote',
                  subtitle: attribution ? `— ${attribution}` : 'Pull Quote'
                };
              }
            }
          },
          {
            name: 'videoEmbed',
            type: 'object',
            title: 'Video Embed',
            fields: [
              { 
                name: 'url', 
                type: 'url', 
                title: 'Video URL (YouTube/Vimeo)', 
                validation: Rule => Rule.warning('Video URL should be specified.') 
              }
            ],
            preview: {
              select: {
                url: 'url'
              },
              prepare({ url }) {
                return {
                  title: url || 'Video Embed',
                  subtitle: 'YouTube / Vimeo Video'
                };
              }
            }
          },
          {
            name: 'codeBlock',
            type: 'object',
            title: 'Code Block',
            fields: [
              { name: 'language', type: 'string', title: 'Language', initialValue: 'javascript' },
              { 
                name: 'code', 
                type: 'text', 
                title: 'Code', 
                rows: 6, 
                validation: Rule => Rule.warning('Code contents should not be empty.') 
              }
            ],
            preview: {
              select: {
                language: 'language',
                code: 'code'
              },
              prepare({ language, code }) {
                return {
                  title: `Code Block: ${language || 'unknown'}`,
                  subtitle: code || 'Empty code block'
                };
              }
            }
          },
          {
            name: 'simpleTable',
            type: 'object',
            title: 'Table',
            fields: [
              {
                name: 'csvData',
                type: 'text',
                title: 'Paste Spreadsheet Data (Excel/Google Sheets)',
                description: 'Simply copy a table grid from Google Sheets or Excel and paste it here directly. (Tabs and commas parse as columns, newlines parse as rows).',
                rows: 6
              },
              {
                name: 'rows',
                type: 'array',
                title: 'Alternative: Manual Rows Builder',
                description: 'Use this only if you want to build rows and cells manually instead of copy-pasting.',
                of: [
                  {
                    type: 'object',
                    name: 'row',
                    fields: [
                      { name: 'cells', type: 'array', title: 'Cells', of: [{ type: 'string' }] }
                    ]
                  }
                ]
              }
            ],
            preview: {
              select: {
                csvData: 'csvData',
                rows: 'rows'
              },
              prepare({ csvData, rows }) {
                if (csvData) {
                  const lines = csvData.split('\n').filter(Boolean).length;
                  return {
                    title: `Table (Spreadsheet: ${lines} rows)`,
                    subtitle: 'Automatic Excel paste parse'
                  };
                }
                const rowCount = rows ? rows.length : 0;
                return {
                  title: `Table (Manual: ${rowCount} rows)`,
                  subtitle: 'Manual builder grid'
                };
              }
            }
          },
          {
            name: 'callout',
            type: 'object',
            title: 'Callout Box',
            fields: [
              { 
                name: 'type', 
                type: 'string', 
                title: 'Type', 
                options: { list: ['info', 'warning', 'success', 'tip'] },
                initialValue: 'info'
              },
              { 
                name: 'text', 
                type: 'text', 
                title: 'Text', 
                rows: 2, 
                validation: Rule => Rule.warning('Callout text should not be empty.') 
              }
            ],
            preview: {
              select: {
                type: 'type',
                text: 'text'
              },
              prepare({ type, text }) {
                return {
                  title: `Callout Box [${type || 'info'}]`,
                  subtitle: text || 'Empty text'
                };
              }
            }
          },
          {
            name: 'socialEmbed',
            type: 'object',
            title: 'Social Media Embed',
            fields: [
              { 
                name: 'platform', 
                type: 'string', 
                title: 'Platform', 
                options: { list: ['youtube', 'twitter', 'instagram'] },
                validation: Rule => Rule.warning('Platform type should be selected.')
              },
              { 
                name: 'url', 
                type: 'url', 
                title: 'Embed URL / Post Link', 
                validation: Rule => Rule.warning('Post URL should be specified.') 
              }
            ],
            preview: {
              select: {
                platform: 'platform',
                url: 'url'
              },
              prepare({ platform, url }) {
                return {
                  title: `${platform || 'Social'} Embed`,
                  subtitle: url || 'Post URL link'
                };
              }
            }
          }
        ]
      }),
      defineField({
        name: 'relatedArticles',
        title: 'Related Articles',
        type: 'array',
        group: 'content',
        of: [{ type: 'reference', to: [{ type: 'article' }] }]
      }),

      defineField({
        name: 'status',
        title: 'Editorial Workflow Status',
        type: 'string',
        group: 'content',
        options: {
          list: [
            { title: 'Draft', value: 'draft' },
            { title: 'In Review', value: 'inReview' },
            { title: 'Approved', value: 'approved' },
            { title: 'Scheduled', value: 'scheduled' },
            { title: 'Published', value: 'published' },
            { title: 'Archived', value: 'archived' }
          ]
        },
        initialValue: 'draft'
      }),
      defineField({
        name: 'isBreaking',
        title: 'Breaking News',
        type: 'boolean',
        group: 'content',
        initialValue: false,
        description: 'Mark this article as Breaking News to display in headers/alerts.'
      }),
      defineField({
        name: 'isLatest',
        title: 'Latest News',
        type: 'boolean',
        group: 'content',
        initialValue: true,
        description: 'Mark this article to list under the Latest Opportunity feeds.'
      }),
      defineField({
        name: 'isFeatured',
        title: 'Featured Article',
        type: 'boolean',
        group: 'content',
        initialValue: false,
        description: 'Mark this article as Featured to highlight it on the homepage hero grids.'
      }),
      defineField({
        name: 'isSponsored',
        title: 'Sponsored Content',
        type: 'boolean',
        group: 'content',
        initialValue: false,
        description: 'Mark this article as Sponsored advertisement/promo.'
      }),
      defineField({
        name: 'readTime',
        title: 'Reading Time (Minutes)',
        type: 'number',
        group: 'content',
        description: 'Optional. Override reading time in minutes. Leave blank to calculate dynamically based on word count.'
      }),

      // 3. SEO Group
      defineField({ 
        name: 'seoTitle', 
        title: 'SEO Title Override', 
        type: 'string', 
        group: 'seo',
        validation: Rule => Rule.required().max(60).warning('SEO title is required and should be under 60 characters for best display on search results.')
      }),
      defineField({ 
        name: 'seoDescription', 
        title: 'SEO Meta Description', 
        type: 'text', 
        rows: 2, 
        group: 'seo',
        validation: Rule => Rule.required().max(160).warning('SEO description is required and should be under 160 characters for best snippet display.')
      }),
      defineField({ name: 'canonicalUrl', title: 'Canonical URL Override', type: 'string', group: 'seo' }),
      defineField({ name: 'ogImage', title: 'Social Share Image Override (OpenGraph/X)', type: 'image', options: { hotspot: true }, group: 'seo' }),
      defineField({
        name: 'twitterCard',
        title: 'Twitter Card Type',
        type: 'string',
        group: 'seo',
        options: {
          list: [
            { title: 'Summary Card', value: 'summary' },
            { title: 'Summary Card with Large Image', value: 'summary_large_image' }
          ]
        },
        initialValue: 'summary_large_image'
      }),
      defineField({ name: 'noIndex', title: 'Exclude from Search Engines (noindex)', type: 'boolean', initialValue: false, group: 'seo' }),
      defineField({ name: 'showNewsletter', title: 'Show Newsletter Form', type: 'boolean', initialValue: true, group: 'seo' })
    ]
  });
}
