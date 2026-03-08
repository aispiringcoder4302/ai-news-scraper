/**
 * AI News Scraper - Headless News Engine
 * Scrapes AI/tech news from 15+ sources via RSS feeds
 * Categorizes by: customer, marketing, sales, operations, productivity, finance, hr
 */

import Parser from 'rss-parser';
import fs from 'fs/promises';

const parser = new Parser({
  customFields: {
    item: ['description', 'content', 'content:encoded']
  }
});

// 15+ AI/Tech News Sources (all have RSS feeds - fast & reliable)
const SOURCES = [
  // AI-specific
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI', category: 'operations' },
  { url: 'https://venturebeat.com/category/ai/feed/', name: 'VentureBeat AI', category: 'operations' },
  { url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml', name: 'The Verge AI', category: 'operations' },
  
  // Customer/Support AI
  { url: 'https://www.chatbotmagazine.com/feed', name: 'Chatbot Magazine', category: 'customer' },
  
  // Marketing/Content AI
  { url: 'https://www.martech.org/feed/', name: 'MarTech', category: 'marketing' },
  { url: 'https://contentmarketinginstitute.com/feed/', name: 'Content Marketing Inst', category: 'marketing' },
  
  // Sales AI
  { url: 'https://www.gong.io/blog/feed/', name: 'Gong (Sales AI)', category: 'sales' },
  
  // Developer/Productivity AI  
  { url: 'https://github.blog/ai-and-ml.atom', name: 'GitHub AI', category: 'productivity' },
  { url: 'https://www.artificialintelligence-news.com/feed/', name: 'AI News', category: 'productivity' },
  
  // General Tech (with AI coverage)
  { url: 'https://arstechnica.com/feed/', name: 'Ars Technica', category: 'operations' },
  { url: 'https://www.wired.com/feed/tag/ai/latest/rss', name: 'Wired AI', category: 'operations' },
  { url: 'https://slashdot.org/slashdot.rss', name: 'Slashdot', category: 'operations' },
  
  // Startups/Product (AI tools)
  { url: 'https://news.ycombinator.com/rss', name: 'Hacker News', category: 'productivity' },
  
  // Business/Enterprise AI
  { url: 'https://www.zdnet.com/news/rss.xml', name: 'ZDNet', category: 'operations' },
  { url: 'https://www.infoworld.com/feed/', name: 'InfoWorld', category: 'operations' },
];

// Keywords to filter AI-relevant articles
const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'gpt', 'chatbot', 
  'openai', 'anthropic', 'claude', 'gemini', 'copilot', 'automation', 'agent', 'agents',
  'voice ai', 'rag', 'retrieval', 'neural', 'model', 'training', 'inference', 'openclaw',
  'autonomous', 'generative', 'deep learning', 'transformer', 'embedding', 'vector'
];

function isAIRelated(title, description) {
  const text = `${title} ${description}`.toLowerCase();
  return AI_KEYWORDS.some(keyword => text.includes(keyword));
}

function cleanHTML(html) {
  if (!html) return '';
  // Basic HTML cleaning
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500); // Limit to 500 chars
}

async function scrapeSource(source) {
  try {
    const feed = await parser.parseURL(source.url);
    const articles = feed.items
      .filter(item => isAIRelated(item.title, item.contentSnippet || item.description || ''))
      .slice(0, 10) // Top 10 per source
      .map(item => ({
        title: item.title,
        url: item.link,
        category: source.category,
        source: source.name,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        body: cleanHTML(item.contentSnippet || item.description || item['content:encoded'] || ''),
      }));
    
    console.log(`✓ ${source.name}: ${articles.length} articles`);
    return articles;
  } catch (error) {
    console.error(`✗ ${source.name}: ${error.message}`);
    return [];
  }
}

async function scrapeAll() {
  console.log('🚀 Starting AI news scrape...\n');
  
  const results = await Promise.all(SOURCES.map(scrapeSource));
  const allArticles = results.flat();
  
  // Remove duplicates by URL
  const uniqueArticles = Array.from(
    new Map(allArticles.map(a => [a.url, a])).values()
  );
  
  // Sort by date (newest first)
  uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // Save to JSON
  const output = {
    updatedAt: new Date().toISOString(),
    totalArticles: uniqueArticles.length,
    articles: uniqueArticles
  };
  
  await fs.writeFile('./data/news.json', JSON.stringify(output, null, 2));
  
  console.log(`\n✅ Scraped ${uniqueArticles.length} AI articles`);
  console.log(`📁 Saved to data/news.json`);
  
  return output;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAll();
}

export { scrapeAll };
