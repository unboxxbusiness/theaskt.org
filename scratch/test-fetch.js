const https = require('https');

console.log('Script started...');

const query = `*[_type == "article" && defined(slug.current) && (status == "published" || !defined(status))] | order(publishedAt desc)[0...20]{
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "coverImageUrl": coverImage.asset->url,
  author->{
    name,
    "avatarUrl": avatar.asset->url
  },
  categories[]->{
    name,
    "slug": slug.current
  },
  tags[]->{
    name,
    "slug": slug.current
  }
}`;

const projectId = 'lg2rm1yc';
const dataset = 'production';
const apiVersion = '2024-01-01';
const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

console.log('Fetching from URL:', url);

https.get(url, (res) => {
  console.log('Response status code:', res.statusCode);
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('Result status:', parsed.result ? 'Success' : 'Error/Empty');
      if (parsed.result) {
        console.log('Number of articles fetched:', parsed.result.length);
        parsed.result.forEach((item, index) => {
          console.log(`\n--- Article ${index + 1} ---`);
          console.log('Title:', item.title);
          console.log('Cover Image URL:', item.coverImageUrl);
          console.log('Author Name:', item.author?.name);
          console.log('Author Avatar URL:', item.author?.avatarUrl);
        });
      } else {
        console.log('Full response:', JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      console.error('Failed to parse response JSON:', e.message);
      console.log('Raw data received (first 500 chars):', data.substring(0, 500));
    }
  });
}).on('error', (err) => {
  console.error('HTTPS Get Error:', err);
});
