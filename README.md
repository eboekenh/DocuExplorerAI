# DocuWeb Explorer

An interactive document reader with AI-powered inline annotations. Upload any document and learn without losing context. Select text, ask questions, and get AI explanations embedded directly within the document.

**Live Demo:** [https://docuweb-app.vercel.app](https://docuweb-app.vercel.app)

## The Problem

When reading long documents (reports, research papers, technical docs), encountering an unfamiliar term or concept means:
1. Open a new tab → search Google → read → switch back → find where you left off
2. Repeat dozens of times, losing focus and context each time

## The Solution

DocuWeb Explorer keeps you **in the document**. Select any word or sentence, ask the AI, and the answer appears as an inline card right where you're reading. No tab-switching, no context loss.

## Features

- **Document Upload** – Supports `.txt`, `.docx`, and `.odt` files
- **Inline AI Annotations** – Select any text to ask questions, get explanations, or simplify content — answers appear as cards embedded in the document
- **Multi-Provider AI** – Gemini 2.0 Flash (primary) with HuggingFace/Llama 3.3 70B automatic fallback
- **Google Search Grounding** – Gemini responses include cited web sources
- **User Authentication** – Email/password auth via Supabase
- **Cloud Persistence** – Auto-saves documents and annotations to Supabase PostgreSQL
- **Document History** – Load, switch between, and delete saved sessions
- **Multi-language UI** – Turkish, English, and German (login page included)
- **Export/Import** – Save and load sessions as JSON files
- **Responsive Design** – Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 4 |
| Styling | Tailwind CSS 3, Lucide React icons |
| AI (Primary) | Google Gemini 2.0 Flash API |
| AI (Fallback) | HuggingFace Inference API (Llama 3.3 70B via Together) |
| Auth & DB | Supabase (Auth + PostgreSQL) |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- A [HuggingFace](https://huggingface.co) API token (fallback)

### Installation

```bash
cd docuweb-app
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_HF_API_KEY=your_huggingface_api_token
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor to create the `sessions` table and Row Level Security policies.

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Set the root directory to `docuweb-app`
4. Add the environment variables in Vercel project settings
5. Deploy

## Project Structure

```
docuweb-app/
├── src/
│   ├── App.jsx            # Main app (document viewer, AI, auto-save, history)
│   ├── main.jsx           # Entry point with Supabase AuthGate
│   ├── supabaseClient.js  # Supabase client initialization
│   └── index.css          # Tailwind CSS imports
├── supabase-schema.sql    # Database schema + RLS policies
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## How It Works

1. **Upload** a document (`.txt`, `.docx`, `.odt`) or try the built-in demo
2. **Read** — the document renders as a clean, readable page
3. **Select** any word or sentence you want to know more about
4. **Ask** a question or use quick actions (Explain, Simplify)
5. **Learn** — the AI answer appears as an inline card right inside the text, with sources
6. **Continue reading** — your annotations are auto-saved to the cloud

## License

**Proprietary — Source-Available.** This code is shared for viewing and evaluation purposes only. Copying, modifying, distributing, or commercial use is not permitted without written permission. See [LICENSE](LICENSE) for details.
