<div align="center">

<img src="public/logo.png" alt="RAG AI Logo" width="96" />

# RAG AI — Intelligent Knowledge Retrieval

**Scrape any website. Ask anything. Get AI answers grounded in real content.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-rag--chatbot--eta.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://rag-chatbot-eta.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-violet?style=for-the-badge)](LICENSE.txt)

🌐 **[https://rag-chatbot-eta.vercel.app](https://rag-chatbot-eta.vercel.app)**

</div>

---

## ✨ What is RAG AI?

RAG AI is a production-grade **Retrieval-Augmented Generation (RAG)** chatbot. Paste any public website URL — it scrapes the page's meaningful content, stores it as vector embeddings in Weaviate, and lets you have a natural conversation with an AI that answers strictly from that source.

Think: _"Chat with any webpage"_ — powered by Groq's blazing-fast LLM inference and a fully modern Next.js 16 frontend.

---

## 🚀 Live Demo

> **[https://rag-chatbot-eta.vercel.app](https://rag-chatbot-eta.vercel.app)**

No sign-up required. Paste a URL, hit **Scrape**, and start asking questions.

---

## 🎯 Key Features

| Feature                      | Description                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| 🕷️ **Smart Scraping**        | Puppeteer extracts only meaningful content — strips nav, footer, ads, cookie banners |
| 🧠 **RAG Pipeline**          | Content → Weaviate vector DB → semantic retrieval → Groq LLM                         |
| 💬 **Streaming Chat**        | Word-by-word typewriter response effect                                              |
| 📚 **Source Citations**      | Every AI answer links back to the original page                                      |
| 🌗 **Dark / Light / System** | Full theme toggle with `next-themes`                                                 |
| 📂 **Collapsible Sidebar**   | Dashboard, searchable History, and Settings panel                                    |
| 💀 **Skeleton Loaders**      | Shimmer placeholders on every async state                                            |
| 📱 **Fully Responsive**      | Mobile-first — sidebar collapses to hamburger on small screens                       |
| ⚡ **Groq LLaMA 3.3**        | Uses `llama-3.3-70b-versatile` — one of the fastest open LLMs                        |

---

## 🛠️ Tech Stack

### Frontend

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack)
- **React 19** + **Tailwind CSS v4**
- **Redux Toolkit** — global chat & scrape state
- **next-themes** — dark/light/system theme
- **lucide-react** — icon set
- **react-markdown** — renders AI responses with full markdown

### Backend (API Routes)

- **Puppeteer** — headless browser scraping
- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)** — serverless Chromium for Vercel
- **[Weaviate](https://weaviate.io)** — vector database (cloud sandbox)
- **[Groq SDK](https://console.groq.com)** — LLM inference (`llama-3.3-70b-versatile`)

### Deployment

- **[Vercel](https://vercel.com)** — zero-config serverless deployment

---

## 📁 Project Structure

```
rag-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/route.js        # RAG query pipeline
│   │   └── scrape/route.js      # Puppeteer scraper + Weaviate ingest
│   ├── components/
│   │   ├── ChatInterface.js     # Streaming chat UI
│   │   ├── URLInput.js          # Scrape form + metadata display
│   │   ├── Sidebar.js           # Collapsible nav, history, settings
│   │   ├── Skeleton.js          # Shimmer loading components
│   │   ├── ThemeToggle.js       # Dark/light switch
│   │   └── Providers.js         # Redux + theme providers
│   ├── store/
│   │   ├── index.js             # Redux store
│   │   └── chatSlice.js         # Messages, scraped URLs, active URL
│   ├── lib/
│   │   ├── groqClient.js        # Groq API client
│   │   └── weaviateClient.js    # Weaviate client
│   ├── layout.js                # Root layout + metadata
│   ├── page.js                  # Main app page
│   └── globals.css              # Design system (shimmer, glass, gradients)
├── public/
├── .env.local                   # Local secrets (not committed)
├── .env.production              # Production secrets (not committed)
└── next.config.mjs
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js ≥ 18
- A [Weaviate Cloud](https://console.weaviate.cloud) account (free sandbox works)
- A [Groq API key](https://console.groq.com) (free tier available)
- Google Chrome installed locally (for Puppeteer in dev)

### 1. Clone

```bash
git clone https://github.com/TheUzair/RAG-Chatbot.git
cd RAG-Chatbot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key

WEAVIATE_URL=https://your-cluster.weaviate.network
WEAVIATE_API_KEY=your_weaviate_api_key
```

> **On Vercel**, set `GROQ_API_KEY`, `WEAVIATE_URL`, and `WEAVIATE_API_KEY` in your project's Environment Variables dashboard. Puppeteer automatically uses `@sparticuz/chromium` in serverless environments.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔄 How It Works

```
User enters URL
      │
      ▼
Puppeteer scrapes page
  ├─ Removes nav/footer/ads/scripts
  └─ Extracts semantic blocks (h1-h6, p, li, blockquote)
      │
      ▼
Text stored in Weaviate as vector embedding
      │
      ▼
User asks a question
      │
      ▼
Weaviate retrieves most relevant chunk via nearVector search
      │
      ▼
Groq LLaMA 3.3-70b generates answer from retrieved context
      │
      ▼
Response streamed word-by-word to UI with source citation
```

---

## 🌐 Deployment on Vercel

This project is pre-configured for Vercel with a `vercel.json` that sets the function memory and timeout needed for Puppeteer:

```json
{
  "functions": {
    "app/api/scrape/route.js": {
      "maxDuration": 60,
      "memory": 3008
    }
  }
}
```

Deploy in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheUzair/RAG-Chatbot)

---

## 🧩 Environment Variables Reference

| Variable           | Required | Description                                                        |
| ------------------ | -------- | ------------------------------------------------------------------ |
| `GROQ_API_KEY`     | ✅       | Groq API key from [console.groq.com](https://console.groq.com)     |
| `WEAVIATE_URL`     | ✅       | Weaviate cluster REST endpoint                                     |
| `WEAVIATE_API_KEY` | ✅       | Weaviate cluster API key                                           |
| `VERCEL`           | Auto-set | Detected automatically on Vercel — switches to serverless Chromium |

---

## 🛑 Known Limitations

| Limitation               | Notes                                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| JavaScript-heavy SPAs    | Some pages that render entirely in-browser may return partial content       |
| Auth-gated pages         | Puppeteer runs without cookies/sessions — paywalled content is inaccessible |
| Frequently updated pages | Re-scrape to refresh embeddings                                             |
| Rate limits              | Groq free tier has RPM limits; errors surface as chat error messages        |

---

## 🗺️ Roadmap

- [ ] Multi-URL context (chat across several scraped sites at once)
- [ ] Persistent chat history (localStorage or DB)
- [ ] Confidence score indicator per AI response
- [ ] PDF / file upload support
- [ ] Multi-turn conversation memory

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org): `feat(scope): description`
4. Open a Pull Request

---

## 📄 License

MIT © [TheUzair](https://github.com/TheUzair) — see [LICENSE.txt](LICENSE.txt) for details.

---

<div align="center">
  Built with ❤️ using Next.js, Groq, Weaviate, and Tailwind CSS
  <br/>
  <a href="https://rag-chatbot-eta.vercel.app">rag-chatbot-eta.vercel.app</a>
</div>
