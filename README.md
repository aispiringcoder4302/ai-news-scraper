# AI News Scraper

Headless AI news aggregator that scrapes 15+ sources and exposes a JSON API.

## 🚀 Features

- Scrapes AI/tech news from **15+ sources** via RSS feeds (fast & reliable)
- Categorizes by: `customer`, `marketing`, `sales`, `operations`, `productivity`, `finance`, `hr`
- Exposes JSON API with `title`, `category`, `body`, `source`, `url`, `publishedAt`
- Filters only AI-relevant articles (GPT, Claude, agents, automation, etc.)
- No rate limits, no scraping bans - uses official RSS feeds

## 📡 API

```bash
GET /api/news
GET /api/news?category=marketing
```

**Response:**
```json
{
  "updatedAt": "2026-03-08T12:30:00Z",
  "totalArticles": 87,
  "articles": [
    {
      "title": "OpenAI releases GPT-5.4...",
      "url": "https://...",
      "category": "operations",
      "source": "TechCrunch AI",
      "publishedAt": "2026-03-08T10:00:00Z",
      "body": "OpenAI today announced..."
    }
  ]
}
```

## 📰 Sources (15+)

1. **TechCrunch AI** - AI section RSS feed
2. **VentureBeat AI** - AI category
3. **The Verge AI** - AI/ML coverage
4. **Chatbot Magazine** - Customer service AI
5. **MarTech** - Marketing AI tools
6. **Content Marketing Inst** - Content AI
7. **Gong Blog** - Sales AI
8. **GitHub AI** - Developer AI
9. **AI News** - General AI news
10. **Ars Technica** - Tech/AI
11. **Wired AI** - AI tag feed
12. **Slashdot** - Tech news
13. **Hacker News** - Startup/AI
14. **ZDNet** - Enterprise AI
15. **InfoWorld** - Business/AI

## 🛠️ Usage

```bash
# Install
npm install

# Scrape once
npm run scrape

# Start API server
npm run serve

# Dev mode (auto-reload)
npm run dev
```

## 🔧 How It Works

1. Uses `rss-parser` to fetch RSS feeds from 15+ sources
2. Filters articles for AI keywords (gpt, llm, agents, automation, etc.)
3. Categorizes by business domain (customer, marketing, sales, etc.)
4. Saves to `data/news.json`
5. Exposes via simple HTTP API

## 🌐 Deploy

Deploy to Vercel, Railway, or any Node.js host. The API runs on port 3003 by default.

**Environment:**
```bash
PORT=3003  # Optional, defaults to 3003
```

## 📝 License

MIT
