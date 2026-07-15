# AI Social Media Agent
### IBM Hackathon — Frontend-Only Implementation

---

## Overview

A complete, fully browser-based **AI Social Media Management Dashboard** built with vanilla HTML, CSS, and JavaScript. No backend, no database, no Node.js, no React — just open `index.html` and go.

The app integrates **Groq's LLaMA 3 API** for real AI-generated captions and hashtags, with a robust local fallback engine so everything works even without an internet connection.

---

## Features

| Feature | Description |
|---|---|
| 🏠 **Dashboard** | Live stat cards (followers, reach, posts, engagement), mini charts, sentiment overview, platform summary table |
| 📡 **Multi-Platform Feed** | Posts from Instagram, X (Twitter), Facebook, LinkedIn — with filter buttons, search, sentiment badges, reach/engagement stats |
| 🤖 **AI Caption Generator** | Groq LLaMA 3–powered caption generation with tone selection (Product, Motivational, Educational, Lifestyle), platform targeting, and typewriter output |
| #️⃣ **Hashtag Generator** | AI-generated or template-based hashtag chips — click to select/deselect, mix trending + niche tags |
| 📸 **Image Upload Preview** | Drag-and-drop or browse image upload with preview, file info, and mood detection |
| 💬 **Sentiment Analyzer** | Real-time text sentiment analysis (Positive / Neutral / Negative) with confidence score and visual bar |
| 🔥 **Trending Hashtags** | Live-style trending list with post counts, growth rates, and fire indicators |
| ⏰ **Best Posting Times** | Per-platform scoring grid (Mon–Sun), best-time highlight, engagement score bar, reference table |
| 🏆 **Competitor Analysis** | Card view with followers, engagement rate, post frequency, strengths/weaknesses, comparison bar chart |
| 📊 **Analytics** | 6 Chart.js charts — weekly reach (line), daily engagement (bar), follower growth (line), platform share (doughnut), post type (polar area), sentiment distribution (doughnut) |
| 📅 **Scheduler** | Schedule new posts with platform/content/datetime form; queue view with status indicators |
| 🌙 **Dark Mode** | Full dark/light theme toggle, persisted to localStorage |
| 🔍 **Search** | Global search filters the social feed in real time |
| 📱 **Responsive** | Mobile-first layout, collapsible sidebar with overlay |
| ⚡ **Live Simulation** | Background ticker bumps likes/comments every 8 seconds to simulate real-time activity |

---

## Project Structure

```
project/
├── index.html     ← Full SPA shell with all section markup
├── style.css      ← Custom design system (CSS variables, dark mode, components)
├── script.js      ← All app logic (nav, AI gen, charts, feed, analysis)
├── data.js        ← Mock data (posts, analytics, competitors, best times, hashtags)
└── README.md      ← This file
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | — | Structure & semantics |
| CSS3 | — | Custom design system, dark mode, responsive |
| Vanilla JavaScript | ES2020+ | All app logic, DOM manipulation |
| Bootstrap 5 | 5.3.3 | Grid system, layout utilities |
| Chart.js | 4.4.3 | 6 analytics chart types |
| Font Awesome | 6.5.1 | Icons |
| Groq API | LLaMA 3 8B | AI caption & hashtag generation |

---

## Setup & Usage

### Option 1 — Open Directly
```bash
# No build step needed — just open in browser
open index.html
```

### Option 2 — Local Server (recommended for Groq API CORS)
```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```
Then visit: `http://localhost:8080`

---

## Groq API Configuration

The app uses the Groq REST API for real AI generation.

- **API Key**: Configured in `script.js` → `GROQ_API_KEY`
- **Model**: `llama3-8b-8192`
- **Endpoint**: `https://api.groq.com/openai/v1/chat/completions`
- **Fallback**: If the API is unavailable (offline, CORS, rate limit), the app automatically falls back to local JavaScript template-based generation — ensuring the app always works.

> ⚠️ **Note**: Never expose API keys in production frontend code. For a real deployment, proxy the Groq API through a backend.

---

## Architecture Decisions

### Single-Page Application (SPA)
All "pages" are `<section>` elements toggled with CSS `display`. No routing library needed.

### Data Layer (`data.js`)
All mock data is defined in `data.js` as plain JavaScript constants. This simulates a real API response and can easily be replaced with `fetch()` calls.

### AI Generation (Hybrid)
1. **Primary**: Call Groq's LLaMA 3 REST API for natural, context-aware captions
2. **Fallback**: Local template engine using `AI_CAPTION_TEMPLATES` and `HASHTAG_SUGGESTIONS` from `data.js`

### Sentiment Analysis
Pure JavaScript keyword matching against `SENTIMENT_KEYWORDS` dictionary. Scores positive/neutral/negative word frequency and normalizes to percentages.

### Charts
All 6 charts use Chart.js 4. Chart instances are stored in `state.chartInstances` and destroyed/recreated on theme change to apply correct colors.

---

## Key Components

```
Dashboard     → Quick stats + recent posts + mini charts + sentiment
Social Feed   → Post cards with platform filter + live search + sentiment badges
AI Generator  → Groq caption gen + hashtag chips + image upload + sentiment analyzer
Scheduler     → Form-based post scheduling + queue management
Trending      → Hashtag list with growth rates + doughnut chart
Timing        → 7-day grid per platform with score bars + reference table
Competitors   → Profile cards with stats + grouped bar comparison chart
Analytics     → 6 Chart.js charts + top posts performance table
```

---

## Browser Compatibility

| Browser | Status |
|---|---|
| Chrome 90+ | ✅ Full support |
| Firefox 88+ | ✅ Full support |
| Safari 14+ | ✅ Full support |
| Edge 90+ | ✅ Full support |
| Mobile Chrome/Safari | ✅ Responsive |

---

## Hackathon Notes

- All data is mock/simulated — no real social media API calls
- The Groq integration is the only external API call; it has a complete offline fallback
- No authentication, no database, no server-side code
- `localStorage` is used only for theme preference persistence

---

*Built for IBM Hackathon — AI Social Media Agent Track*
