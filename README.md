# DocuWeb - Interactive Document Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/yourorg/docuweb-app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-live-success.svg)](https://docuweb-app.vercel.app)

> **Transform your documents into interactive experiences with AI-powered annotations**

DocuWeb is a modern, intelligent document platform that enables users to upload documents and create interactive annotations through AI-powered question-and-answer functionality. Built with React, Vite, and Supabase, it offers multi-language support, intelligent AI fallbacks, and comprehensive analytics.

[🚀 **Live Demo**](https://docuweb-app.vercel.app) | [📖 **Documentation**](docs/) | [🎯 **Features**](#features) | [⚡ **Quick Start**](#quick-start)

---

## ✨ Features

### 🤖 **AI-Powered Interactions**
- **Smart Annotations**: Select any text and ask questions to get instant AI explanations
- **Multi-Model AI**: Primary Google Gemini with HuggingFace backup for reliability  
- **Context-Aware**: AI responses based on document context and user questions
- **Intelligent Retries**: Automatic fallback with exponential backoff and error handling

### 📄 **Document Management**
- **Multiple Formats**: Support for Word (.docx), text files (.txt), and ODT format
- **Auto-Save**: Real-time saving of all changes and annotations via Supabase
- **Session Management**: Organize and revisit previous document sessions
- **Multi-Language**: Interface in English, Turkish, and German

### 📊 **Performance Monitoring**
- **Real-time Analytics**: Track AI response times, user interactions, and performance metrics
- **Error Tracking**: Comprehensive error monitoring with context and retry logic
- **Network Resilience**: Offline detection and graceful degradation

### 🔐 **Security & Privacy**
- **Secure Authentication**: Email/password with Supabase Auth
- **Row-Level Security**: Database-level user data isolation
- **Guest Mode**: Try features without registration

---

## 🌟 Live Demo

### [🚀 Try DocuWeb Now](https://docuweb-app.vercel.app)

**What to try:**
1. 📤 Upload a document (.txt, .docx, .odt) or use demo mode
2. 🖱️ Select any text in your document  
3. ❓ Ask AI questions like "What does this mean?" or "Summarize this"
4. 🤖 Get intelligent, context-aware responses with sources
5. 💾 Your work is automatically saved and organized

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18.0.0 or higher
- **Supabase** account (free tier works fine)
- **Google AI API** key for Gemini Pro
- **HuggingFace** API token (optional, for backup AI)

### 5-Minute Setup

```bash
# Clone and install
git clone https://github.com/yourorg/docuweb-app.git
cd docuweb-app
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Environment Configuration

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-api-key  
VITE_HF_API_KEY=your-huggingface-token
```

### Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your SQL Editor
3. Enable Row Level Security policies (included in schema)

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + Vite | Fast, modern UI development |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Backend** | Supabase | Auth, database, real-time features |
| **Database** | PostgreSQL | Reliable data storage with JSONB |
| **AI Primary** | Google Gemini Pro | Advanced text understanding |
| **AI Backup** | HuggingFace (Llama 3.3) | Reliable fallback processing |
| **Deployment** | Vercel | Edge network hosting |
| **Monitoring** | Custom Analytics | Performance and error tracking |

---

## 📁 Project Structure

```
docuweb-app/
├── 📁 src/                      # Source code
│   ├── 📄 App.jsx               # Main application with AI integration
│   ├── 📄 main.jsx              # Authentication and app entry
│   ├── 📄 supabaseClient.js     # Database configuration
│   ├── 📄 analytics.js          # Performance monitoring
│   └── 📄 index.css             # Tailwind styles
├── 📁 docs/                     # Comprehensive documentation
│   ├── 📄 features-planning.md  # Product roadmap & features
│   ├── 📄 technical-documentation.md # Architecture & design
│   ├── 📄 api-documentation.md  # API reference
│   ├── 📄 installation-guide.md # Setup & deployment
│   ├── 📄 test-plan.md          # Testing strategy
│   └── 📄 user-manual.md        # User guide & tutorials  
├── 📄 supabase-schema.sql       # Database schema
├── 📄 package.json              # Dependencies
└── 📄 README.md                 # This file
```

---

## 📖 Documentation

| Document | Audience | Purpose |
|----------|----------|---------|
| **[🎯 Features & Roadmap](docs/features-planning.md)** | Product Team | Feature matrix, user stories, roadmap |
| **[🏗️ Technical Architecture](docs/technical-documentation.md)** | Developers | System design, database schema, AI integration |  
| **[📡 API Reference](docs/api-documentation.md)** | Integrators | Supabase API usage, data models, examples |
| **[🔧 Installation & Deployment](docs/installation-guide.md)** | DevOps | Environment setup, production deployment |
| **[🧪 Testing Strategy](docs/test-plan.md)** | QA Team | Test cases, automation, performance testing |
| **[👥 User Manual](docs/user-manual.md)** | End Users | Interface guide, tutorials, troubleshooting |

---

## 🚀 Development

```bash
# Development server
npm run dev          # Start with hot reload at localhost:5173

# Production build  
npm run build        # Create optimized build in dist/
npm run preview      # Preview production build
```

### Key Features Implemented

- ✅ **Multi-language UI** (English, Turkish, German)
- ✅ **AI-powered annotations** with fallback providers
- ✅ **Document upload** (.txt, .docx, .odt support) 
- ✅ **Real-time auto-save** via Supabase
- ✅ **Performance monitoring** with custom analytics
- ✅ **Error handling** with exponential backoff retries
- ✅ **Network resilience** and offline detection
- ✅ **Mobile-responsive** design with touch support
- ✅ **Guest mode** for trying without registration

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Import from GitHub to Vercel
2. **Environment Variables**: Add all required ENV vars in settings  
3. **Deploy**: Automatic deployment on every push to main

### Manual Deployment
```bash
npm run build
vercel --prod
```

---

## 📊 Performance & Monitoring

DocuWeb includes built-in performance monitoring:

- **AI Response Times**: Track latency across providers
- **User Interactions**: Monitor document uploads, annotations, language changes
- **Error Tracking**: Detailed error logging with context
- **Network Health**: Connection status and retry analytics

View performance data in browser console (development mode) or integrate with external monitoring services.

---

## 🤝 Contributing

We welcome contributions! Please see our documentation:

1. **[Technical Architecture](docs/technical-documentation.md)** for system understanding
2. **[Test Plan](docs/test-plan.md)** for testing guidelines  
3. **[Installation Guide](docs/installation-guide.md)** for development setup

### Quick Contribution Guide
```bash
# Fork and clone your fork
git clone https://github.com/yourusername/docuweb-app.git
cd docuweb-app

# Install and setup
npm install
cp .env.example .env.local
# Add your API keys to .env.local  

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test, and submit PR
npm run dev  # Test your changes
# Submit pull request with clear description
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification and distribution permitted  
- ✅ Private use allowed
- ❗ License notice required in distributions

---

## 💬 Support & Community

### Getting Help
- 📖 **[User Manual](docs/user-manual.md)** - Complete usage guide
- 🐛 **[Issues](https://github.com/yourorg/docuweb-app/issues)** - Bug reports and feature requests
- 📧 **Email**: support@docuweb.com

### Roadmap & Future Features
- 📱 **Mobile Apps** (iOS/Android with React Native)
- 👥 **Real-time Collaboration** (multi-user document editing)
- 🔌 **API Integration** (Google Docs, Notion, Slack)
- 📊 **Analytics Dashboard** (usage insights and document stats)
- 🎨 **Themes & Customization** (dark mode, custom branding)

---

## 📈 Project Stats

- **Languages**: JavaScript (React), SQL (PostgreSQL)  
- **Bundle Size**: ~200KB gzipped (optimized with Vite)
- **Performance**: <3s load time, <2s AI response average
- **Database**: PostgreSQL with Row-Level Security
- **Deployment**: Edge network (Vercel) with global CDN

---

**Built with ❤️ for better document understanding**

---

*Made by the DocuWeb Team • [Live Demo](https://docuweb-app.vercel.app) • [Documentation](docs/)*
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
