const fs = require('fs');
const path = require('path');
const https = require('https');

// Paths
const ENV_PATH = path.join(__dirname, '..', '.env');
const GENERATED_DIR = path.join(__dirname, 'editorial', 'generated');
const ARCHIVED_DIR = path.join(__dirname, 'editorial', 'archived');
const FAILED_DIR = path.join(__dirname, 'editorial', 'failed');

// Ensure directories exist
[GENERATED_DIR, ARCHIVED_DIR, FAILED_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load Env variables
let envConfig = {};
console.log(`[DEBUG] Looking for .env file at: ${ENV_PATH}`);
console.log(`[DEBUG] .env file exists: ${fs.existsSync(ENV_PATH)}`);
if (fs.existsSync(ENV_PATH)) {
  const envContent = fs.readFileSync(ENV_PATH, 'utf-8').replace(/\r/g, '');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (match) {
      let key = match[1];
      let value = match[2] ? match[2].trim() : '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      }
      envConfig[key] = value;
    }
  });
  console.log(`[DEBUG] Loaded keys from .env: ${Object.keys(envConfig).join(', ')}`);
}

const PROJECT_ID = envConfig.NEXT_PUBLIC_SANITY_PROJECT_ID || 'lg2rm1yc';
const DATASET = envConfig.NEXT_PUBLIC_SANITY_DATASET || 'production';
const WRITE_TOKEN = envConfig.SANITY_API_WRITE_TOKEN || envConfig.SANITY_TOKEN || process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_TOKEN;

// AI Career and Opportunity Topics Database (Rich Portable Text & High SEO/AI Search Optimizations)
const TOPICS_DB = [
  {
    pillar: 'AI Tools',
    title: 'Claude 3.5 Sonnet: The Ultimate Workflow Guide for Professionals',
    keywords: ['Claude 3.5 Sonnet', 'Anthropic', 'AI coding', 'workflow optimization'],
    excerpt: 'Learn how to leverage Claude 3.5 Sonnet to optimize your development workflows, automate coding tasks, and design complex systems with real-world examples.',
    seoTitle: 'Claude 3.5 Sonnet Workflow Guide for Professionals | TheAskt',
    seoDescription: 'Master Claude 3.5 Sonnet to optimize development workflows, build AI projects, and scale automation. Complete step-by-step tutorial.',
    content: [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Anthropic\'s Claude 3.5 Sonnet has set a new benchmark for intelligence, speed, and coding capabilities. For professionals looking to turn AI into a career multiplier, mastering this tool is no longer optional—it is a critical advantage.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'TL;DR' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Claude 3.5 Sonnet dominates coding and logical reasoning benchmarks compared to other models.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Its 200k context window allows you to analyze complete directories and codebases.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Configuring custom system instructions is key to generating production-ready outputs.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Integrating Claude with IDEs like Cursor dramatically accelerates software delivery.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'What\'s Happening?' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Unlike previous models that merely generate text, Claude 3.5 Sonnet excels at reasoning, understanding context, and managing multi-file workspaces. Whether you are writing a backend API, refactoring legacy code, or drafting business documentation, it acts as an elite pair programmer.' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Furthermore, the introducing of Artifacts allows developers to run, preview, and iterate on visual prototypes (like React components and SVG designs) directly inside the chat interface.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Why It Matters' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'In today\'s development landscape, efficiency is the ultimate differentiator. Developers who learn to co-write code with Claude 3.5 Sonnet report up to a 10x improvement in feature shipping speeds.' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Failing to establish structured prompting guidelines when working with Claude often results in technical debt and repetitive code blocks.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'The Opportunity' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Mastering Claude 3.5 Sonnet allows you to build complex projects as a solopreneur or small team:' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Develop and deploy full-stack applications without needing large engineering teams.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Offer custom workflow engineering services to businesses looking to integrate AI.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Accelerate your learning curve by using Claude as an interactive computer science tutor.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'What Professionals Should Do Next' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Create a dedicated system prompt that defines Claude\'s role as an expert architect.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Provide clear code style guides and constraints (e.g., \"Use Next.js Server Actions\").' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Break down complex features into single files and ask Claude to iterate on them sequentially.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: 'Review all generated code blocks for security vulnerabilities before deploying.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Key Takeaways' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: '✓ Claude 3.5 Sonnet represents the gold standard for logical coding capabilities.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: '✓ The 200k context window allows for complete system-wide analysis.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: '✓ Interactive Artifacts speed up layout and component prototyping.' }] },
      { _type: 'block', style: 'normal', listItem: 'bullet', level: 1, children: [{ _type: 'span', text: '✓ Explicit instructions are crucial to avoid code iteration loops.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Frequently Asked Questions (FAQ)' }] },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'Does Claude 3.5 Sonnet replace the need to learn how to code?' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'No. While Claude writes excellent code, you must understand logic, system design, and debugging to direct the agent effectively and build secure applications.' }] },
      { _type: 'block', style: 'h3', children: [{ _type: 'span', text: 'How do I pass my codebase context to Claude?' }] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'You can use tools like `llms-txt` or prompt directories, or paste index trees and file outlines directly into Claude\'s window.' }] },
      { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Final Take' }] },
      { _type: 'block', style: 'blockquote', children: [{ _type: 'span', text: 'AI tools like Claude do not reduce the value of developers; they amplify the value of builders. Master these systems today to stay at the absolute forefront of the new economy.' }] }
    ]
  }
];

// Helper to make Sanity API calls
function sanityApiRequest(method, endpoint, payload = null) {
  return new Promise((resolve, reject) => {
    if (!WRITE_TOKEN) {
      reject(new Error("SANITY_API_WRITE_TOKEN is missing in .env. Configure it to publish."));
      return;
    }

    const path = `/v2024-01-01${endpoint}`;
    const options = {
      hostname: `${PROJECT_ID}.api.sanity.io`,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WRITE_TOKEN}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (payload) {
      req.write(JSON.stringify(payload));
    }
    req.end();
  });
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// 1. Research Topics Command
async function runResearch() {
  console.log('\n=== RUNNING EDITORIAL RESEARCH ===');
  console.log(`Analyzing brand pillars and searching for high-intent opportunity clusters...`);
  
  const opportunities = TOPICS_DB.map((t, idx) => ({
    id: idx + 1,
    pillar: t.pillar,
    topic: t.title,
    intent: 'Informational / Action-oriented',
    priority: 'High',
    targetKeywords: t.keywords
  }));

  console.log('\nRecommended Editorial Calendar:');
  console.table(opportunities);
  
  const researchFile = path.join(__dirname, 'editorial', 'research_report.json');
  fs.writeFileSync(researchFile, JSON.stringify(opportunities, null, 2));
  console.log(`\nResearch report saved to: ${researchFile}`);
}

// 2. Write Article Command
async function runWrite() {
  console.log('\n=== RUNNING ARTICLE WRITING ===');
  
  const topic = TOPICS_DB[Math.floor(Math.random() * TOPICS_DB.length)];
  const slug = slugify(topic.title);
  
  console.log(`Writing article: "${topic.title}"...`);

  const articleDoc = {
    _type: 'article',
    _id: `drafts.article-${slug}`,
    title: topic.title,
    slug: {
      _type: 'slug',
      current: slug
    },
    publishedAt: new Date().toISOString(),
    excerpt: topic.excerpt,
    content: topic.content,
    status: 'draft',
    isLatest: true,
    isFeatured: false,
    isBreaking: false,
    seoTitle: topic.seoTitle,
    seoDescription: topic.seoDescription,
    showNewsletter: true,
    primaryKeyword: topic.primaryKeyword,
    secondaryKeywords: topic.secondaryKeywords,
    tldr: topic.tldr,
    faqs: topic.faqs,
    sources: topic.sources
  };

  const filename = `article-${slug}.json`;
  const filepath = path.join(GENERATED_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(articleDoc, null, 2));
  
  console.log(`Article written successfully! Saved to: ${filepath}`);
  return filepath;
}

// 3. Publish Article Command
async function runPublish() {
  console.log('\n=== RUNNING EDITORIAL PUBLISHING ===');

  const files = fs.readdirSync(GENERATED_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.log('No pending generated articles found in editorial/generated/. Run write first.');
    return;
  }

  if (!WRITE_TOKEN) {
    console.warn('\n[WARNING] SANITY_API_WRITE_TOKEN is missing in .env.');
    console.warn('The generated articles will remain locally in editorial/generated/ for local review.');
    return;
  }

  console.log(`Found ${files.length} article(s) to publish.`);

  for (const file of files) {
    const filePath = path.join(GENERATED_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    try {
      const doc = JSON.parse(content);
      console.log(`Publishing: "${doc.title}" to Sanity...`);

      const publishedDoc = { ...doc };
      publishedDoc._id = doc._id.replace('drafts.', '');
      publishedDoc.status = 'published';

      const mutation = {
        mutations: [
          {
            createOrReplace: publishedDoc
          }
        ]
      };

      await sanityApiRequest('POST', '/data/mutate/production', mutation);
      console.log(`Successfully published! Document ID: ${publishedDoc._id}`);

      fs.renameSync(filePath, path.join(ARCHIVED_DIR, file));
      console.log(`Archived ${file} to editorial/archived/`);

    } catch (err) {
      console.error(`Failed to publish ${file}:`, err.message);
      fs.renameSync(filePath, path.join(FAILED_DIR, file));
    }
  }
}

// Main Execution Router
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--research')) {
    await runResearch();
  } else if (args.includes('--write')) {
    await runWrite();
  } else if (args.includes('--publish')) {
    await runPublish();
  } else {
    // Default to write then publish
    await runWrite();
    await runPublish();
  }
}

main();
