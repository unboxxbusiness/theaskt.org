import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Question', 
      type: 'string', 
      validation: Rule => Rule.required().error('Question is required.') 
    }),
    defineField({ 
      name: 'content', 
      title: 'Answer', 
      type: 'array', 
      of: [{ type: 'block' }], 
      validation: Rule => Rule.required().error('Answer is required.') 
    })
  ]
});
