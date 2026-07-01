import { defineField, defineType } from 'sanity';

export const announcement = defineType({
  name: 'announcement',
  title: 'Announcement',
  type: 'document',
  fields: [
    defineField({ 
      name: 'title', 
      title: 'Title', 
      type: 'string', 
      validation: Rule => Rule.required().error('Title is required.') 
    }),
    defineField({ 
      name: 'description', 
      title: 'Description', 
      type: 'text', 
      rows: 2, 
      validation: Rule => Rule.required().error('Description is required.') 
    }),
    defineField({ 
      name: 'ctaText', 
      title: 'CTA Button Text', 
      type: 'string' 
    }),
    defineField({ 
      name: 'ctaLink', 
      title: 'CTA Button Link', 
      type: 'string' 
    }),
    defineField({ 
      name: 'bgColor', 
      title: 'Background Color (Hex)', 
      type: 'string', 
      initialValue: '#14213d',
      description: 'Starting color of the background (or single solid background color).'
    }),
    defineField({ 
      name: 'gradientEndColor', 
      title: 'Gradient End Color (Optional Hex)', 
      type: 'string',
      description: 'Optional ending color to create a beautiful gradient background.'
    }),
    defineField({
      name: 'countdownTarget',
      title: 'Countdown Target Date & Time',
      type: 'datetime',
      description: 'Set this target date to enable a live countdown timer directly in the announcement banner.'
    }),
    defineField({ 
      name: 'active', 
      title: 'Active / Visible', 
      type: 'boolean', 
      initialValue: true 
    })
  ]
});
