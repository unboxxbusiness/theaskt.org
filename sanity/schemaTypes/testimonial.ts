import { defineField, defineType } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Name', 
      type: 'string', 
      validation: Rule => Rule.required().error('Name is required.') 
    }),
    defineField({ 
      name: 'quote', 
      title: 'Testimonial Text', 
      type: 'text', 
      rows: 4, 
      validation: Rule => Rule.required().error('Testimonial text is required.') 
    }),
    defineField({ 
      name: 'designation', 
      title: 'Designation / Role', 
      type: 'string' 
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'designation'
    }
  }
});
