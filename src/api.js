/**
 * Simple API server - exposes scraped news as JSON
 * GET /api/news - returns all articles
 * GET /api/news?category=marketing - filter by category
 */

import http from 'http';
import fs from 'fs/promises';
import { scrapeAll } from './scraper.js';

const PORT = process.env.PORT || 3003;

async function getNews() {
  try {
    const data = await fs.readFile('./data/news.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If no data, scrape now
    console.log('No cached data, scraping...');
    return await scrapeAll();
  }
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url.startsWith('/api/news')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const category = url.searchParams.get('category');
    
    let news = await getNews();
    
    // Filter by category if provided
    if (category) {
      news = {
        ...news,
        articles: news.articles.filter(a => a.category === category)
      };
    }
    
    res.writeHead(200);
    res.end(JSON.stringify(news, null, 2));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 AI News API running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: http://localhost:${PORT}/api/news`);
});
