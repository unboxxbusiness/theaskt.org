import { StructureResolver } from 'sanity/structure';
import { 
  BookOpen, 
  Home, 
  Settings, 
  User, 
  Folder, 
  Tag, 
  FileText, 
  Compass, 
  Layers, 
  Mail, 
  HelpCircle, 
  MessageSquare, 
  Megaphone,
  Image as ImageIcon
} from 'lucide-react';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Article top-level document list
      S.documentTypeListItem('article')
        .title('Article')
        .icon(BookOpen),

      // Homepage Settings top-level list
      S.listItem()
        .title('Homepage Settings')
        .icon(Home)
        .child(
          S.list()
            .title('Homepage Settings & Sections')
            .items([
              S.listItem()
                .title('Global Homepage Settings')
                .icon(Home)
                .child(
                  S.document()
                    .schemaType('homepage')
                    .documentId('homepage')
                    .title('Global Homepage Settings')
                ),
              S.documentTypeListItem('faq').title('FAQ').icon(HelpCircle),
              S.documentTypeListItem('testimonial').title('Testimonial').icon(MessageSquare),
            ])
        ),

      // Site & Layout Settings top-level list
      S.listItem()
        .title('Site & Layout Settings')
        .icon(Settings)
        .child(
          S.list()
            .title('Site Settings & Config')
            .items([
              S.listItem()
                .title('Global Site Settings')
                .icon(Settings)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Global Site Settings')
                ),
              S.documentTypeListItem('announcement').title('Announcement').icon(Megaphone),
            ])
        ),

      // Author
      S.documentTypeListItem('author')
        .title('Author')
        .icon(User),

      // Category
      S.documentTypeListItem('category')
        .title('Category')
        .icon(Folder),

      // Tag
      S.documentTypeListItem('tag')
        .title('Tag')
        .icon(Tag),

      // Media
      S.documentTypeListItem('sanity.imageAsset')
        .title('Media')
        .icon(ImageIcon),
    ]);
