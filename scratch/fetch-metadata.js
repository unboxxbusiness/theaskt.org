const https = require('https');
const fs = require('fs');

console.log('Script starting...');

const projectId = 'lg2rm1yc'; // Askt project ID
const dataset = 'production';
const apiVersion = '2024-01-01';

const query = `{
  "authors": *[_type == "author"]{ _id, name, "slug": slug.current },
  "categories": *[_type == "category"]{ _id, name, "slug": slug.current },
  "tags": *[_type == "tag"]{ _id, name, "slug": slug.current }
}`;

const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

https.get(url, (res) => {
  console.log('Response status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      fs.writeFileSync('e:\\apps\\askt\\scratch\\output.json', JSON.stringify(parsed.result, null, 2));
      console.log('File written successfully.');
    } catch (e) {
      console.error('Error parsing:', e.message);
      fs.writeFileSync('e:\\apps\\askt\\scratch\\output.json', JSON.stringify({ error: e.message, raw: data }, null, 2));
    }
  });
}).on('error', (err) => {
  console.error('HTTPS Error:', err.message);
  fs.writeFileSync('e:\\apps\\askt\\scratch\\output.json', JSON.stringify({ error: err.message }, null, 2));
});
