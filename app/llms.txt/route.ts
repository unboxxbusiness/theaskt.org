import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://theaskt.com';

const llmsContent = `# TheAskt — AI Career & Opportunity Platform
## https://theaskt.com

TheAskt is an AI career intelligence platform that helps professionals learn practical AI skills,
access analytical career resources, and book personalized mentorship sessions.

## What We Do

- **AI Career Program™**: A structured, mentor-led program to build real-world AI skills in tools
  like Python, Machine Learning, Automation, and Prompt Engineering.
- **Learn Hub**: A curated library of long-form articles, step-by-step tutorials, and analytical
  guides across AI, career development, and productivity.
- **Career Sessions**: Free one-on-one career guidance sessions with TheAskt mentors.
- **Weekly Newsletter**: The TheAskt Chronicle — a weekly briefing on AI career opportunities,
  industry tools, and learning resources.

## Key Pages

- Homepage: ${baseUrl}/
- Learn Hub (all articles): ${baseUrl}/learn
- AI Career Program™: ${baseUrl}/career-program
- Book a Session: ${baseUrl}/book-session
- Contact: ${baseUrl}/contact
- About: ${baseUrl}/about
- Newsletter: ${baseUrl}/newsletter

## Content Architecture

All editorial content is managed via Sanity CMS and organized by:
- **Categories**: Topic-based groupings (e.g., AI Tools, Career Development, Automation)
- **Tags**: Keyword-level tagging for fine-grained discovery
- **Authors**: Expert contributors with biography and social profiles

## Machine-Readable Feeds

- Sitemap: ${baseUrl}/sitemap.xml
- RSS Feed: ${baseUrl}/feed.xml

## Data & Privacy

TheAskt uses Firestore for user-generated data (contact forms, newsletter signups, session bookings).
No user data is stored in Sanity CMS. Privacy Policy: ${baseUrl}/privacy-policy

## Contact & Authorship

TheAskt Editorial Team — https://theaskt.com/contact

This file follows the llms.txt specification: https://llmstxt.org/
`;

export async function GET() {
  return new NextResponse(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
