import { author } from './author';
import { category } from './category';
import { tag } from './tag';
import { homepage } from './homepage';
import { siteSettings } from './siteSettings';
import { faq } from './faq';
import { testimonial } from './testimonial';
import { announcement } from './announcement';
import { createContentSchema } from './contentFactory';

export const schemaTypes = [
  author,
  category,
  tag,
  homepage,
  siteSettings,
  faq,
  testimonial,
  announcement,
  createContentSchema('article', 'Article')
];
export type SchemaTypeNames = 'article' | 'faq' | 'testimonial' | 'announcement';
