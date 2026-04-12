# DocuWeb Explorer

Turn text documents into interactive web pages with AI-powered annotations.

**Live Demo:** [https://docuweb-app.vercel.app](https://docuweb-app.vercel.app)

## Features

- **Document Upload** – Supports `.txt`, `.docx`, and `.odt` files
- **Interactive Annotations** – Select any text to ask AI questions, get explanations, or simplify content
- **Multi-Provider AI** – Gemini 2.0 Flash (primary) with HuggingFace/Llama 3.3 70B fallback
- **Google Search Grounding** – Gemini responses include cited web sources
- **User Authentication** – Email/password auth via Supabase
- **Cloud Persistence** – Auto-saves documents and annotations to Supabase PostgreSQL
- **Document History** – Load, switch between, and delete saved sessions
- **Multi-language UI** – Turkish, English, and German
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

1. **Upload** a document (`.txt`, `.docx`, `.odt`) or try the demo
2. **Select** any text in the rendered document
3. **Ask** a question or use quick actions (Explain, Simplify)
4. **AI** responds with an inline annotation card, complete with sources
5. **Auto-save** keeps your work synced to the cloud

## License

MIT
