import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient.js';
import { 
  trackAIResponse, 
  trackUserAction, 
  trackError, 
  getPerformanceInsights 
} from './analytics.js';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  X, 
  Search, 
  MessageSquare, 
  Loader2, 
  ChevronRight,
  Info,
  Globe,
  Download,
  FolderOpen,
  LogOut,
  Save,
  Cloud,
  CloudOff,
  History,
  Trash2,
  Plus,
  Menu,
  Filter,
  HelpCircle
} from 'lucide-react';

// --- YARDIMCI FONKSİYONLAR ---

// Dış kütüphaneleri dinamik yüklemek için yardımcı fonksiyon
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = "anonymous";
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
    document.head.appendChild(script);
  });
};

// --- ÇEVİRİ DESTEĞİ ---
const translations = {
  tr: {
    subtitle: "Metni Yaşayan Bir Web Sitesine Çevir",
    newDoc: "Yeni Belge",
    exportBtn: "Dışa Aktar",
    exportNotes: "Notları Dışa Aktar",
    exportSession: "Oturumu Dışa Aktar", 
    exportNotesMarkdown: "Notlar (Markdown)",
    exportNotesHtml: "Notlar (HTML)",
    exportNotesJson: "Notlar (JSON)",
    importBtn: "İçe Aktar",
    importErr: "Geçersiz veya bozuk oturum dosyası.",
    uploadTitle: "Okunacak Belgeyi Yükle",
    uploadDesc: "Herhangi bir .txt, .docx veya .odt dosyasını seç ve sihrin gerçekleşmesini izle. Metin interaktif bir web sayfasına dönüşecek.",
    reading: "Okunuyor...",
    selectFile: "Dosya Seç",
    or: "veya",
    demoBtn: "Örnek Belge Dene",
    errType: "Sadece .txt, .docx ve .odt dosyaları desteklenmektedir.",
    errEmpty: "Belge içinde okunabilir metin bulunamadı.",
    errRead: "Dosya okunurken bir hata oluştu. Dosya bozuk veya desteklenmeyen formatta olabilir.",
    step1Title: "Metni Seç",
    step1Desc: "Öğrenmek istediğin kelimenin veya cümlenin üzerini çiz.",
    step2Title: "Sorunu Sor",
    step2Desc: "Açılan menüden ne olduğunu veya detayını yapay zekaya sor.",
    step3Title: "Web İçinde Web",
    step3Desc: "Cevap, metnin tam ortasına yeni bir interaktif kart olarak gömülsün.",
    guideTitle: "Belgeniz Web Sayfasına Dönüştü!",
    guideDesc: "Metin içerisindeki herhangi bir kelimeyi veya cümleyi fare (veya parmağınız) ile seçerek ona dair bir",
    guideStrong: '"Sayfa içi Web Sayfası"',
    guideEnd: "oluşturabilirsiniz.",
    untitled: "İsimsiz Belge",
    about: "hakkında",
    loadingAI: "Yapay zeka araştırıyor ve yanıtı oluşturuyor...",
    deleteNote: "Bu notu sil",
    askQ: "Soru Sor",
    placeholder: "Bu nedir, açıkla...",
    explainBtn: "Ne olduğunu açıkla",
    simplifyBtn: "Basitleştir",
    explainPrompt: "Bunun ne olduğunu detaylı açıkla.",
    simplifyPrompt: "Bunu daha basit bir dille özetle.",
    aiSystem: "Sen yetenekli bir asistansın. Kullanıcı sana bir metin parçasını ve o metinle ilgili sorusunu iletecek. Açıklayıcı, net ve {LANG} dilinde yanıt ver. Okumayı kolaylaştırmak için kısa paragraflar kullan.",
    langName: "Türkçe",
    defaultPrompt: "Bu metni açıkla ve ne olduğunu detaylandır.",
    sourcesTitle: "Kaynaklar",
    mobileAnnotateBtn: "Not ekle",
    mobileAnnotateTitle: "Mobilde Not Ekleme",
    mobileAnnotateDesc: "Mobilde not eklemek için önce metni çift tıklayarak ve sürükleyerek seçin, ardından beliren popup menüsünü kullanın.",
    mobileAnnotateStart: "Anladım, not eklemeye başla",
    tutorialTitle: "Nasıl Kullanılır",
    prevBtn: "Önceki",
    nextBtn: "Sonraki", 
    finishBtn: "Bitir",
    documents: "Dökümanlar",
    searchPlaceholder: "Döküman ara...",
    refresh: "Yenile",
    loadingDocs: "Dökümanlar yükleniyor...",
    noSearchResults: "Arama sonucu bulunamadı",
    noDocs: "Henüz döküman yok",
    retryBtn: "Tekrar dene",
    aiServicesDown: "Tüm AI servisleri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.",
    aiRequestFailed: "AI isteği başarısız oldu:",
    aiRequestFailedRetry: "AI isteği tekrar başarısız oldu:",
    recent: "Son 10",
    all: "Tümü",
    demoMode: "Demo Modu"
  },
  en: {
    subtitle: "Turn Text into a Living Website",
    newDoc: "New Document",
    exportBtn: "Export",
    exportNotes: "Export Notes",
    exportSession: "Export Session",
    exportNotesMarkdown: "Notes (Markdown)", 
    exportNotesHtml: "Notes (HTML)",
    exportNotesJson: "Notes (JSON)",
    importBtn: "Import",
    importErr: "Invalid or corrupted session file.",
    uploadTitle: "Upload Document to Read",
    uploadDesc: "Select any .txt, .docx, or .odt file and watch the magic happen. The text will turn into an interactive webpage.",
    reading: "Reading...",
    selectFile: "Select File",
    or: "or",
    demoBtn: "Try Demo Document",
    errType: "Only .txt, .docx, and .odt files are supported.",
    errEmpty: "No readable text found in the document.",
    errRead: "An error occurred while reading the file. It might be corrupted or unsupported.",
    step1Title: "Select Text",
    step1Desc: "Highlight the word or sentence you want to learn about.",
    step2Title: "Ask a Question",
    step2Desc: "Ask the AI what it is or ask for details from the pop-up menu.",
    step3Title: "Web within Web",
    step3Desc: "Let the answer be embedded right in the middle of the text as a new interactive card.",
    guideTitle: "Your Document is Now a Webpage!",
    guideDesc: "Select any word or sentence with your mouse (or finger) to create an",
    guideStrong: '"In-page Webpage"',
    guideEnd: "about it.",
    untitled: "Untitled Document",
    about: "about",
    loadingAI: "AI is researching and generating the answer...",
    deleteNote: "Delete this note",
    askQ: "Ask a Question",
    placeholder: "What is this, explain...",
    explainBtn: "Explain what this is",
    simplifyBtn: "Simplify",
    explainPrompt: "Explain what this is in detail.",
    simplifyPrompt: "Summarize this in a simpler language.",
    aiSystem: "You are a capable assistant. The user will provide a text snippet and their question. Give a clear, explanatory answer in {LANG}. Use short paragraphs to improve readability.",
    langName: "English",
    defaultPrompt: "Explain this text and detail what it is.",
    sourcesTitle: "Sources",
    mobileAnnotateBtn: "Add annotation",
    mobileAnnotateTitle: "Mobile Annotation",
    mobileAnnotateDesc: "To add annotations on mobile, first select text by double-tapping and dragging, then use the popup menu that appears.",
    mobileAnnotateStart: "Got it, start annotating",
    tutorialTitle: "How to Use",
    prevBtn: "Previous",
    nextBtn: "Next",
    finishBtn: "Finish",
    documents: "Documents",
    searchPlaceholder: "Search documents...",
    refresh: "Refresh",
    loadingDocs: "Loading documents...",
    noSearchResults: "No search results found",
    noDocs: "No documents yet",
    retryBtn: "Retry",
    aiServicesDown: "All AI services are currently unavailable. Please try again later.",
    aiRequestFailed: "AI request failed:",
    aiRequestFailedRetry: "AI request failed again:",
    recent: "Recent 10",
    all: "All",
    demoMode: "Demo Mode"
  },
  de: {
    subtitle: "Verwandle Text in eine lebendige Website",
    newDoc: "Neues Dokument",
    exportBtn: "Exportieren", 
    exportNotes: "Notizen Exportieren",
    exportSession: "Sitzung Exportieren",
    exportNotesMarkdown: "Notizen (Markdown)",
    exportNotesHtml: "Notizen (HTML)",
    exportNotesJson: "Notizen (JSON)",
    importBtn: "Importieren",
    importErr: "Ungültige oder beschädigte Sitzungsdatei.",
    uploadTitle: "Dokument zum Lesen hochladen",
    uploadDesc: "Wähle eine .txt-, .docx- oder .odt-Datei und sieh zu, wie die Magie geschieht. Der Text wird zu einer interaktiven Webseite.",
    reading: "Lese...",
    selectFile: "Datei auswählen",
    or: "oder",
    demoBtn: "Beispieldokument ausprobieren",
    errType: "Nur .txt-, .docx- und .odt-Dateien werden unterstützt.",
    errEmpty: "Kein lesbarer Text im Dokument gefunden.",
    errRead: "Beim Lesen der Datei ist ein Fehler aufgetreten. Sie ist möglicherweise beschädigt.",
    step1Title: "Text auswählen",
    step1Desc: "Markiere das Wort oder den Satz, über den du mehr erfahren möchtest.",
    step2Title: "Frage stellen",
    step2Desc: "Frage die KI aus dem Popup-Menü, was es ist oder nach Details.",
    step3Title: "Web im Web",
    step3Desc: "Lass die Antwort als neue interaktive Karte direkt in die Mitte des Textes einbetten.",
    guideTitle: "Ihr Dokument ist jetzt eine Webseite!",
    guideDesc: "Wähle ein Wort oder einen Satz mit der Maus (oder dem Finger) aus, um eine",
    guideStrong: '"In-Page-Webseite"',
    guideEnd: "darüber zu erstellen.",
    untitled: "Unbenanntes Dokument",
    about: "über",
    loadingAI: "KI recherchiert und generiert die Antwort...",
    deleteNote: "Diese Notiz löschen",
    askQ: "Frage stellen",
    placeholder: "Was ist das, erkläre...",
    explainBtn: "Erkläre, was das ist",
    simplifyBtn: "Vereinfachen",
    explainPrompt: "Erkläre im Detail, was das ist.",
    simplifyPrompt: "Fasse dies in einer einfacheren Sprache zusammen.",
    aiSystem: "Du bist ein fähiger Assistent. Der Benutzer wird dir einen Textausschnitt und eine Frage dazu geben. Antworte klar, erklärend und auf {LANG}. Verwende kurze Absätze für bessere Lesbarkeit.",
    langName: "Deutsch",
    defaultPrompt: "Erkläre diesen Text und detailliere, was er ist.",
    sourcesTitle: "Quellen",
    mobileAnnotateBtn: "Anmerkung hinzufügen",
    mobileAnnotateTitle: "Mobile Anmerkung",
    mobileAnnotateDesc: "Um Anmerkungen auf dem Handy hinzuzufügen, wählen Sie zuerst Text durch Doppeltippen und Ziehen aus, dann verwenden Sie das erscheinende Popup-Menü.",
    mobileAnnotateStart: "Verstanden, mit Anmerkungen beginnen",
    tutorialTitle: "Anleitung",
    prevBtn: "Zurück",
    nextBtn: "Weiter",
    finishBtn: "Fertig",
    documents: "Dokumente",
    searchPlaceholder: "Dokumente suchen...",
    refresh: "Aktualisieren",
    loadingDocs: "Dokumente laden...",
    noSearchResults: "Keine Suchergebnisse gefunden",
    noDocs: "Noch keine Dokumente",
    retryBtn: "Wiederholen",
    aiServicesDown: "Alle KI-Dienste sind derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.",
    aiRequestFailed: "KI-Anfrage fehlgeschlagen:",
    aiRequestFailedRetry: "KI-Anfrage erneut fehlgeschlagen:",
    recent: "Letzte 10",
    all: "Alle",
    demoMode: "Demo Modus"
  }
};

// --- AI PROVIDER SİSTEMİ (Enhanced with Retry Logic) ---

// Enhanced error handling with exponential backoff
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const executeWithRetry = async (fn, maxAttempts = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await fn();
      if (result) return result;
    } catch (error) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await sleep(delay);
    }
  }
  return null;
};

// Network connectivity check
const isOnline = () => {
  return navigator.onLine && window.fetch;
};

// Request timeout wrapper
const withTimeout = (promise, timeout = 30000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
};

// Gemini API çağrısı (Enhanced)
const callGemini = async (prompt, systemPromptText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!isOnline()) throw new Error('Network connection unavailable');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPromptText }] },
    tools: [{ google_search: {} }]
  };

  const fetchRequest = fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const response = await withTimeout(fetchRequest, 30000); // 30 second timeout

  if (response.status === 429) return null; // Rate limit → fallback
  if (response.status === 503) return null; // Service unavailable → fallback
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Yanıt alınamadı.";

  const attributions = data.candidates?.[0]?.groundingMetadata?.groundingAttributions || [];
  const extractedSources = attributions
    .map(a => a.web)
    .filter(web => web && web.uri && web.title)
    .map(web => ({ uri: web.uri, title: web.title }));
  const uniqueSources = Array.from(new Map(extractedSources.map(item => [item.uri, item])).values());

  return { text, sources: uniqueSources };
};

// HuggingFace Inference API çağrısı (Enhanced)
const callHuggingFace = async (prompt, systemPromptText) => {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  if (!apiKey) return null;
  if (!isOnline()) throw new Error('Network connection unavailable');

  const fetchRequest = fetch(
    'https://router.huggingface.co/together/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
        messages: [
          { role: 'system', content: systemPromptText },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    }
  );

  const response = await withTimeout(fetchRequest, 30000); // 30 second timeout

  if (response.status === 429 || response.status === 503) return null;
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HuggingFace HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "Yanıt alınamadı.";
  return { text, sources: [] };
};

// Ana AI çağrı fonksiyonu — Enhanced with retry logic and analytics tracking
const callAI = async (prompt, langCode = 'tr') => {
  const startTime = performance.now();
  const langName = translations[langCode].langName;
  const systemPromptText = translations[langCode].aiSystem.replace("{LANG}", langName);

  // Track user interaction
  trackUserAction('ai_request_started', { 
    prompt_length: prompt.length, 
    language: langCode 
  });

  // Check network connectivity first
  if (!isOnline()) {
    const errorResult = { 
      text: translations[langCode].aiServicesDown + " (No internet connection)", 
      sources: [], 
      error: 'network' 
    };
    trackAIResponse('network_check', performance.now() - startTime, false, 'no_connection');
    return errorResult;
  }

  const providers = [
    { name: 'gemini', fn: () => executeWithRetry(() => callGemini(prompt, systemPromptText), 2, 1000) },
    { name: 'huggingface', fn: () => executeWithRetry(() => callHuggingFace(prompt, systemPromptText), 2, 1000) }
  ];

  let lastError = null;
  
  for (const provider of providers) {
    const providerStartTime = performance.now();
    try {
      const result = await provider.fn();
      if (result && result.text) {
        const responseTime = performance.now() - startTime;
        const providerResponseTime = performance.now() - providerStartTime;
        
        // Track successful AI response
        trackAIResponse(provider.name, providerResponseTime, true, null);
        trackUserAction('ai_request_completed', { 
          provider: provider.name,
          total_time: responseTime,
          provider_time: providerResponseTime,
          response_length: result.text.length,
          sources_count: result.sources?.length || 0
        });
        
        return result;
      }
    } catch (err) {
      lastError = err;
      const providerResponseTime = performance.now() - providerStartTime;
      
      // Track failed AI response
      trackAIResponse(provider.name, providerResponseTime, false, err.message);
      
      console.warn('Provider failed, trying next:', err.message);
      
      // Add user-friendly error categorization
      if (err.message.includes('timeout')) {
        console.warn('Request timeout, trying next provider...');
      } else if (err.message.includes('429')) {
        console.warn('Rate limit hit, trying next provider...');
      } else if (err.message.includes('Network connection')) {
        console.warn('Network issue detected...');
        break; // No point trying other providers if network is down
      }
    }
  }

  // All providers failed - return appropriate error message
  const totalTime = performance.now() - startTime;
  const errorMessage = lastError?.message.includes('Network connection') 
    ? translations[langCode].aiServicesDown + " (Network unavailable)"
    : translations[langCode].aiServicesDown;
    
  // Track complete failure
  trackUserAction('ai_request_failed', { 
    total_time: totalTime,
    last_error: lastError?.message,
    all_providers_failed: true
  });
    
  return { 
    text: errorMessage, 
    sources: [], 
    error: 'all_failed',
    lastError: lastError?.message 
  };
};

// Seçilen metnin asıl paragraf içindeki başlangıç/bitiş indislerini hesaplar
const getAbsoluteOffset = (container, targetNode, targetOffset) => {
  const treeWalker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
  let offset = 0;
  let currentNode = treeWalker.nextNode();

  while (currentNode) {
    if (currentNode === targetNode) {
      return offset + targetOffset;
    }
    offset += currentNode.length;
    currentNode = treeWalker.nextNode();
  }
  return offset;
};

// Benzersiz ID oluşturucu
const generateId = () => Math.random().toString(36).substring(2, 9);

// Düz metinde tablo algılama fonksiyonu
const detectTableInText = (text) => {
  // Almanca tablo başlıkları veya tipik tablo yapıları arayalım
  const tablePatterns = [
    /Hersteller.*Hauptvorteil.*Preis/i,
    /\|.*\|.*\|/,
    /─{3,}/,
    /\s{4,}/,
    /^\s*\w+\s+\w+\s+\w+\s*$/m
  ];
  
  const hasMultipleColumns = text.split('\n').some(line => 
    line.includes('\t') || 
    line.split(/\s{2,}/).length >= 3 ||
    line.includes('|')
  );
  
  return tablePatterns.some(pattern => pattern.test(text)) || hasMultipleColumns;
};

// Metin tablosunu HTML'e çevirme fonksiyonu
const convertTextToTable = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return null;
  
  let html = '<table>';
  
  lines.forEach((line, index) => {
    const cells = line.split(/\t|\s{2,}|\|/).filter(cell => cell.trim());
    if (cells.length < 2) return;
    
    html += '<tr>';
    cells.forEach(cell => {
      const tag = index === 0 ? 'th' : 'td'; // İlk satır başlık
      html += `<${tag}>${cell.trim()}</${tag}>`;
    });
    html += '</tr>';
  });
  
  html += '</table>';
  return html;
};

// --- ANA BİLEŞEN ---

export default function App({ isGuestMode = false }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_language') || 'en'
  });
  const t = translations[lang];

  const [documentTitle, setDocumentTitle] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const [annotations, setAnnotations] = useState({}); 
  const [selectionMenu, setSelectionMenu] = useState(null); 
  const [questionInput, setQuestionInput] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [saveStatus, setSaveStatus] = useState(isGuestMode ? 'demo' : 'idle'); // Add 'demo' status
  const [sessionId, setSessionId] = useState(null);
  const [sessionList, setSessionList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768); // Show by default on desktop
  
  // Mobile annotation helper
  const [showMobileAnnotate, setShowMobileAnnotate] = useState(false);
  
  // Enhanced search function
  const performAdvancedSearch = useCallback((sessions, searchTerm, filters) => {
    if (!searchTerm && Object.values(filters).every(f => f === 'any')) {
      return sessions;
    }

    const searchLower = searchTerm.toLowerCase();
    const now = new Date();
    
    return sessions.filter(session => {
      // Date filtering
      if (filters.dateRange !== 'any') {
        const sessionDate = new Date(session.updated_at || session.created_at);
        const daysDiff = (now - sessionDate) / (1000 * 60 * 60 * 24);
        
        if (filters.dateRange === 'today' && daysDiff > 1) return false;
        if (filters.dateRange === 'week' && daysDiff > 7) return false;
        if (filters.dateRange === 'month' && daysDiff > 30) return false;
      }

      // Language filtering
      if (filters.language !== 'any' && session.lang !== filters.language) {
        return false;
      }

      // Annotation filtering
      if (filters.annotated !== 'any') {
        const hasAnnotations = session.annotations && Object.keys(session.annotations).length > 0;
        if (filters.annotated === 'yes' && !hasAnnotations) return false;
        if (filters.annotated === 'no' && hasAnnotations) return false;
      }

      // Text search
      if (!searchTerm) return true;

      const title = (session.document_title || t.untitled).toLowerCase();
      
      // Search in title
      if (filters.searchIn === 'title' || filters.searchIn === 'all') {
        if (title.includes(searchLower)) return true;
      }

      // Search in content  
      if (filters.searchIn === 'content' || filters.searchIn === 'all') {
        const content = session.paragraphs || [];
        const contentText = content.map(p => p.content || p.text || '').join(' ').toLowerCase();
        if (contentText.includes(searchLower)) return true;
      }

      // Search in annotations
      if (filters.searchIn === 'annotations' || filters.searchIn === 'all') {
        const annotations = session.annotations || {};
        for (const paragraphAnns of Object.values(annotations)) {
          for (const ann of paragraphAnns) {
            const annText = `${ann.question || ''} ${ann.answer || ''} ${ann.text || ''}`.toLowerCase();
            if (annText.includes(searchLower)) return true;
          }
        }
      }

      // Default to title search for backwards compatibility
      return filters.searchIn === 'all' && title.includes(searchLower);
    });
  }, [t.untitled]);

  // Track search interactions
  const handleSearchChange = useCallback((value) => {
    setSidebarSearch(value);
    if (value.length >= 3) {
      trackUserAction('search_performed', { 
        search_term: value,
        search_filters: searchFilters,
        results_count: performAdvancedSearch(sessionList, value, searchFilters).length
      });
    }
  }, [searchFilters, sessionList, performAdvancedSearch]);

  const handleFilterChange = useCallback((filterKey, value) => {
    setSearchFilters(prev => ({ ...prev, [filterKey]: value }));
    trackUserAction('search_filter_changed', { 
      filter: filterKey, 
      value,
      search_term: sidebarSearch 
    });
  }, [sidebarSearch]);
  // Search state
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    searchIn: 'all', // 'title', 'content', 'annotations', 'all'
    language: 'any', // 'en', 'tr', 'de', 'any'
    dateRange: 'any', // 'today', 'week', 'month', 'any'
    annotated: 'any' // 'yes', 'no', 'any'
  });
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  
  const menuRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // Export menu'yu kapatmak için click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.relative')) {
        setShowExportMenu(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showExportMenu]);

  // --- Supabase: Oturum Yükleme ---
  useEffect(() => {
    if (isGuestMode) return; // Skip Supabase operations in guest mode
    
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setSessionId(data.id);
        setDocumentTitle(data.document_title || '');
        setParagraphs(data.paragraphs || []);
        setAnnotations(data.annotations || {});
        setLang(data.lang || 'en');
        localStorage.setItem('app_language', data.lang || 'en');
      }
    };  
    loadSession();
  }, [isGuestMode]);

  // --- Supabase: Otomatik Kaydetme ---
  const saveToSupabase = useCallback(async (title, paras, anns, currentLang) => {
    if (isGuestMode) {
      // In guest mode, just show demo status without actually saving
      setSaveStatus('demo');
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setSaveStatus('saving');
    try {
      const payload = {
        user_id: user.id,
        document_title: title,
        paragraphs: paras,
        annotations: anns,
        lang: currentLang,
        updated_at: new Date().toISOString()
      };

      if (sessionId) {
        const { error } = await supabase
          .from('sessions')
          .update(payload)
          .eq('id', sessionId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('sessions')
          .insert(payload)
          .select('id')
          .single();
        if (error) throw error;
        if (data) setSessionId(data.id);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('error');
    }
  }, [sessionId, isGuestMode]);

  // Debounced auto-save: her değişiklikten 2 saniye sonra kaydet
  useEffect(() => {
    if (!documentTitle && paragraphs.length === 0) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveToSupabase(documentTitle, paragraphs, annotations, lang);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [documentTitle, paragraphs, annotations, lang, saveToSupabase]);

  // --- Döküman Geçmişi: Listeyi Yükle ---
  const loadSessionList = async () => {
    if (isGuestMode) {
      // In guest mode, show empty list or sample data
      setSessionList([]);
      setLoadingHistory(false);
      return;
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('id, document_title, updated_at, lang')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    if (data && !error) setSessionList(data);
    setLoadingHistory(false);
  };

  // Load sessions when sidebar opens
  useEffect(() => {
    if (showSidebar) {
      loadSessionList();
    }
  }, [showSidebar]);

  // Geçmiş paneli açıldığında listeyi yükle
  useEffect(() => {
    if (showHistory) loadSessionList();
  }, [showHistory]);

  // --- Döküman Geçmişi: Oturum Yükle ---
  const loadSessionById = async (id) => {
    if (isGuestMode) {
      // Guest mode - can't load saved sessions
      return;
    }
    
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();
    if (data && !error) {
      setSessionId(data.id);
      setDocumentTitle(data.document_title || '');
      setParagraphs(data.paragraphs || []);
      setAnnotations(data.annotations || {});
      setLang(data.lang || 'en');
      localStorage.setItem('app_language', data.lang || 'en');
      setShowHistory(false);
    }
  };

  // --- Döküman Geçmişi: Oturum Sil ---
  const deleteSession = async (id) => {
    if (isGuestMode) {
      // Guest mode - can't delete sessions
      return;
    }
    
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (!error) {
      setSessionList(prev => prev.filter(s => s.id !== id));
      if (sessionId === id) {
        setSessionId(null);
        setDocumentTitle('');
        setParagraphs([]);
        setAnnotations({});
      }
    }
  };

  // --- Yeni Belge ---
  const handleNewDocument = () => {
    setSessionId(null);
    setDocumentTitle('');
    setParagraphs([]);
    setAnnotations({});
    setErrorMsg(null);
    setShowHistory(false);
  };

  // --- Çıkış Yap ---
  const handleLogout = async () => {
    if (isGuestMode) {
      // For guest mode, just reload to go back to auth
      window.location.reload();
      return;
    }
    
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Oturumu Dışa Aktar (Export)
  const handleExport = () => {
    const sessionData = {
      docuWebVersion: "1.0",
      documentTitle,
      paragraphs,
      annotations
    };
    
    const blob = new Blob([JSON.stringify(sessionData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'docuweb_session'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Notları Farklı Formatlarda Export Et
  const exportNotes = (format) => {
    const allNotes = [];
    Object.keys(annotations).forEach(paragraphId => {
      annotations[paragraphId].forEach(ann => {
        const paragraph = paragraphs.find(p => p.id === paragraphId);
        allNotes.push({
          paragraphText: paragraph?.text || '',
          selectedText: ann.text,
          question: ann.question,
          answer: ann.answer,
          sources: ann.sources || []
        });
      });
    });

    if (allNotes.length === 0) {
      alert(lang === 'tr' ? 'Henüz not eklenmemiş!' : lang === 'de' ? 'Noch keine Notizen hinzugefügt!' : 'No notes added yet!');
      return;
    }

    let content, mimeType, extension;

    switch (format) {
      case 'markdown':
        content = generateMarkdownNotes(allNotes);
        mimeType = 'text/markdown';
        extension = 'md';
        break;
      case 'html':
        content = generateHtmlNotes(allNotes);
        mimeType = 'text/html';
        extension = 'html';
        break;
      case 'json':
        content = JSON.stringify(allNotes, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentTitle || 'docuweb'}-notes.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Markdown formatında not oluştur
  const generateMarkdownNotes = (notes) => {
    let markdown = `# ${documentTitle || 'DocuWeb'} - Notlar\n\n`;
    markdown += `*${new Date().toLocaleDateString()} tarihinde oluşturuldu*\n\n`;
    
    notes.forEach((note, index) => {
      markdown += `## Not ${index + 1}\n\n`;
      markdown += `**Seçilen Metin:** "${note.selectedText}"\n\n`;
      markdown += `**Soru:** ${note.question}\n\n`;
      markdown += `**Cevap:**\n${note.answer}\n\n`;
      if (note.sources && note.sources.length > 0) {
        markdown += `**Kaynaklar:**\n`;
        note.sources.forEach(source => {
          markdown += `- [${source.title}](${source.url})\n`;
        });
        markdown += '\n';
      }
      markdown += `---\n\n`;
    });
    
    return markdown;
  };

  // HTML formatında not oluştur
  const generateHtmlNotes = (notes) => {
    let html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentTitle || 'DocuWeb'} - Notlar</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .note { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; background: #f8fafc; }
        .selected-text { background: #fef3cd; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .question { color: #374151; font-weight: 600; margin: 15px 0 10px 0; }
        .answer { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; }
        .sources { margin-top: 15px; }
        .sources a { color: #3b82f6; text-decoration: none; }
        .sources a:hover { text-decoration: underline; }
        h1 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .meta { color: #6b7280; font-style: italic; margin-bottom: 30px; }
    </style>
</head>
<body>
    <h1>${documentTitle || 'DocuWeb'} - Notlar</h1>
    <p class="meta">${new Date().toLocaleDateString()} tarihinde oluşturuldu</p>
`;

    notes.forEach((note, index) => {
      html += `
    <div class="note">
        <h3>Not ${index + 1}</h3>
        <p><strong>Seçilen Metin:</strong> <span class="selected-text">"${note.selectedText}"</span></p>
        <div class="question">Soru: ${note.question}</div>
        <div class="answer">${note.answer.replace(/\n/g, '<br>')}</div>
`;
      if (note.sources && note.sources.length > 0) {
        html += `        <div class="sources">
            <strong>Kaynaklar:</strong><br>
`;
        note.sources.forEach(source => {
          html += `            <a href="${source.url}" target="_blank">${source.title}</a><br>
`;
        });
        html += `        </div>
`;
      }
      html += `    </div>
`;
    });

    html += `
</body>
</html>`;
    
    return html;
  };

  // Oturumu İçe Aktar (Import)
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.docuWebVersion) {
          setDocumentTitle(data.documentTitle || '');
          setParagraphs(data.paragraphs || []);
          setAnnotations(data.annotations || {});
          setErrorMsg(null);
        } else {
          setErrorMsg(t.importErr);
        }
      } catch (err) {
        setErrorMsg(t.importErr);
      }
    };
    reader.readAsText(file);
    e.target.value = null; // Aynı dosyayı tekrar seçebilmek için sıfırla
  };

  // Örnek doküman yükleme (Seçili Dile Göre)
  const loadDemo = () => {
    if (lang === 'en') {
      setDocumentTitle("Quantum Computers and the Future");
      setParagraphs([
        { id: generateId(), type: 'p', text: 'Quantum computers, unlike classical computers, use quantum bits called qubits. While classical bits can only take the value 0 or 1, qubits can be both 0 and 1 at the same time thanks to the principle of superposition. This gives them immense computational power.' },
        { id: generateId(), type: 'h3', text: 'What is Quantum Entanglement?' },
        { id: generateId(), type: 'p', text: 'Additionally, through another feature called quantum entanglement, qubits can act as if they are connected over a distance. A change made to one instantly affects the other.' },
        { id: generateId(), type: 'h3', text: 'Potential Use Cases' },
        { id: generateId(), type: 'li', text: 'Drug discovery and molecular modeling' },
        { id: generateId(), type: 'li', text: 'Complex weather forecasting and climate modeling' },
        { id: generateId(), type: 'li', text: 'Cryptography and cybersecurity' },
        { id: generateId(), type: 'h3', text: 'Challenges Faced' },
        { id: generateId(), type: 'p', text: 'In the future, this technology is expected to fundamentally change many fields. However, keeping these systems stable and overcoming the problem of quantum decoherence is one of the biggest engineering challenges right now.' }
      ]);
    } else if (lang === 'de') {
      setDocumentTitle("Quantencomputer und die Zukunft");
      setParagraphs([
        { id: generateId(), type: 'p', text: 'Quantencomputer verwenden im Gegensatz zu klassischen Computern Quantenbits, sogenannte Qubits. Während klassische Bits nur den Wert 0 oder 1 annehmen können, können Qubits dank des Superpositionsprinzips gleichzeitig sowohl 0 als auch 1 sein. Dies verleiht ihnen eine immense Rechenleistung.' },
        { id: generateId(), type: 'h3', text: 'Was ist Quantenverschränkung?' },
        { id: generateId(), type: 'p', text: 'Darüber hinaus können sich Qubits durch eine weitere Eigenschaft, die Quantenverschränkung, so verhalten, als ob sie über eine gewisse Entfernung miteinander verbunden wären. Eine an einem Qubit vorgenommene Änderung wirkt sich sofort auf das andere aus.' },
        { id: generateId(), type: 'h3', text: 'Potenzielle Anwendungsfälle' },
        { id: generateId(), type: 'li', text: 'Arzneimittelentdeckung und molekulare Modellierung' },
        { id: generateId(), type: 'li', text: 'Komplexe Wettervorhersagen und Klimamodellierung' },
        { id: generateId(), type: 'li', text: 'Kryptographie und Cybersicherheit' },
        { id: generateId(), type: 'h3', text: 'Herausforderungen' },
        { id: generateId(), type: 'p', text: 'Es wird erwartet, dass diese Technologie in Zukunft viele Bereiche grundlegend verändern wird. Diese Systeme jedoch stabil zu halten und das Problem der Quantendekohärenz zu überwinden, ist derzeit eine der größten technischen Herausforderungen.' }
      ]);
    } else {
      setDocumentTitle("Kuantum Bilgisayarlar ve Gelecek");
      setParagraphs([
        { id: generateId(), type: 'p', text: 'Kuantum bilgisayarlar, klasik bilgisayarlardan farklı olarak kübit adı verilen kuantum bitleri kullanır. Klasik bitler sadece 0 veya 1 değerini alabilirken, kübitler süperpozisyon ilkesi sayesinde aynı anda hem 0 hem de 1 olabilirler. Bu durum, onlara muazzam bir hesaplama gücü sağlar.' },
        { id: generateId(), type: 'h3', text: 'Kuantum Dolanıklık Nedir?' },
        { id: generateId(), type: 'p', text: 'Ayrıca, kuantum dolanıklık adı verilen bir diğer özellik sayesinde kübitler birbirlerine uzaktan bağlıymış gibi hareket edebilirler. Biri üzerinde yapılan bir değişiklik, anında diğerini etkiler.' },
        { id: generateId(), type: 'h3', text: 'Potansiyel Kullanım Alanları' },
        { id: generateId(), type: 'li', text: 'İlaç keşifleri ve moleküler modelleme' },
        { id: generateId(), type: 'li', text: 'Karmaşık hava tahminleri ve iklim modellemesi' },
        { id: generateId(), type: 'li', text: 'Kriptografi ve siber güvenlik' },
        { id: generateId(), type: 'h3', text: 'Karşılaşılan Zorluklar' },
        { id: generateId(), type: 'p', text: 'Gelecekte bu teknolojinin pek çok alanı kökünden değiştirmesi bekleniyor. Ancak bu sistemleri stabil tutmak ve kuantum dekoherans sorununu aşmak şu anki en büyük mühendislik zorluklarından biridir.' }
      ]);
    }
  };

  // Dosya Yükleme İşlemi — Enhanced with analytics tracking
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Track document upload start
    const uploadStartTime = performance.now();
    trackUserAction('document_upload_started', { 
      file_name: file.name,
      file_size: file.size,
      file_type: file.type,
      file_extension: file.name.split('.').pop().toLowerCase()
    });
    
    setErrorMsg(null);
    setIsReadingFile(true);
    setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
    const fileExtension = file.name.split('.').pop().toLowerCase();

    try {
      let parsedParagraphs = [];
      
      if (fileExtension === 'txt') {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target.result);
          reader.onerror = (error) => reject(error);
          reader.readAsText(file);
        });
        parsedParagraphs = text.split('\n\n').map(tText => {
          const textStr = tText.trim();
          if (!textStr) return null;
          let type = 'p';
          if (textStr.length < 80 && !/[.!?:]$/.test(textStr)) type = 'h2';
          else if (/^[-*]\s/.test(textStr)) {
            type = 'li';
            return { id: generateId(), type, text: textStr.replace(/^[-*]\s/, '') };
          }
          return { id: generateId(), type, text: textStr };
        }).filter(Boolean);
      } else if (fileExtension === 'docx') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js');
        const arrayBuffer = await file.arrayBuffer();
        const result = await window.mammoth.convertToHtml({ arrayBuffer }); 
        const html = result.value;
        console.log('Mammoth HTML output:', html); // Debug için
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const walk = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li'].includes(tag)) {
                    const text = node.textContent.trim();
                    if (text) {
                        // Düz metinde tablo pattern'i var mı kontrol et
                        if (detectTableInText(text)) {
                            console.log('Table detected in text:', text);
                            const tableHtml = convertTextToTable(text);
                            if (tableHtml) {
                                parsedParagraphs.push({ 
                                    id: generateId(), 
                                    type: 'table', 
                                    text: '', 
                                    html: tableHtml 
                                });
                                return;
                            }
                        }
                        parsedParagraphs.push({ id: generateId(), type: tag, text });
                    }
                } else if (tag === 'table') {
                    console.log('Table element found:', node.outerHTML); // Debug için
                    // Tablo elementini HTML olarak koruyalım
                    const tableHtml = node.outerHTML;
                    if (tableHtml.trim()) {
                        parsedParagraphs.push({ 
                            id: generateId(), 
                            type: 'table', 
                            text: '', // Boş metin
                            html: tableHtml // Ham HTML'i saklayalım
                        });
                    }
                } else {
                    node.childNodes.forEach(walk);
                }
            }
        };
        doc.body.childNodes.forEach(walk);
      } else if (fileExtension === 'odt') {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
        const arrayBuffer = await file.arrayBuffer();
        const zip = await window.JSZip.loadAsync(arrayBuffer);
        const contentXml = await zip.file("content.xml").async("string");
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contentXml, "text/xml");
        
        const elements = Array.from(xmlDoc.getElementsByTagName("*")).filter(el => 
            el.nodeName === 'text:h' || el.nodeName === 'text:p' || el.nodeName === 'table:table'
        );
        
        elements.forEach(el => {
            if (el.nodeName === 'table:table') {
                // ODT tablosunu HTML'e çevir
                const tableHtml = convertOdtTableToHtml(el);
                if (tableHtml.trim()) {
                    parsedParagraphs.push({ 
                        id: generateId(), 
                        type: 'table', 
                        text: '', 
                        html: tableHtml 
                    });
                }
                return;
            }
            
            const textContent = el.textContent.trim();
            if (!textContent) return;
            let type = 'p';
            if (el.nodeName === 'text:h') {
                const level = el.getAttribute('text:outline-level') || '2';
                type = `h${level}`;
            } else if (el.parentNode && el.parentNode.nodeName === 'text:list-item') {
                type = 'li';
            }
            parsedParagraphs.push({ id: generateId(), type, text: textContent });
        });
        
        // ODT tablosunu HTML'e çevirme fonksiyonu
        function convertOdtTableToHtml(tableEl) {
            let html = '<table>';
            
            const rows = Array.from(tableEl.getElementsByTagName('table:table-row'));
            rows.forEach((row, rowIndex) => {
                html += '<tr>';
                const cells = Array.from(row.getElementsByTagName('table:table-cell'));
                cells.forEach(cell => {
                    const isHeader = rowIndex === 0; // İlk satırı başlık olarak kabul et
                    const tag = isHeader ? 'th' : 'td';
                    const text = cell.textContent.trim() || '';
                    html += `<${tag}>${text}</${tag}>`;
                });
                html += '</tr>';
            });
            
            html += '</table>';
            return html;
        }
      } else {
        setErrorMsg(t.errType);
        setIsReadingFile(false);
        return;
      }

      if (parsedParagraphs.length === 0) {
        setErrorMsg(t.errEmpty);
        trackUserAction('document_upload_failed', { 
          error_type: 'empty_document',
          file_name: file.name,
          processing_time: performance.now() - uploadStartTime
        });
      } else {
        setParagraphs(parsedParagraphs);
        trackUserAction('document_upload_completed', { 
          file_name: file.name,
          file_size: file.size,
          paragraphs_count: parsedParagraphs.length,
          processing_time: performance.now() - uploadStartTime,
          file_extension: fileExtension
        });
      }
    } catch (error) {
      console.error("Dosya okuma hatası:", error);
      setErrorMsg(t.errRead);
      trackError(error, { 
        context: 'file_upload',
        file_name: file.name,
        file_type: fileExtension,
        processing_time: performance.now() - uploadStartTime
      });
      trackUserAction('document_upload_failed', { 
        error_type: 'processing_error',
        error_message: error.message,
        file_name: file.name,
        processing_time: performance.now() - uploadStartTime
      });
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleMouseUp = (event) => {
    // Longer delay for mobile devices to allow selection to complete
    const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
    const delay = isMobile ? 150 : 50;
    
    setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      
      const paragraphEl = container.nodeType === 3 
        ? container.parentElement.closest('.paragraph-block')
        : container.closest('.paragraph-block');

      if (!paragraphEl) return;

      const paragraphId = paragraphEl.getAttribute('data-id');
      const start = getAbsoluteOffset(paragraphEl, range.startContainer, range.startOffset);
      const end = getAbsoluteOffset(paragraphEl, range.endContainer, range.endOffset);
      const selectedText = selection.toString().trim();

      if (!selectedText || start === end) return;

      const existingAnns = annotations[paragraphId] || [];
      const hasOverlap = existingAnns.some(ann => 
        (start >= ann.start && start < ann.end) || 
        (end > ann.start && end <= ann.end) ||
        (start <= ann.start && end >= ann.end)
      );

      if (hasOverlap) return;

      const rect = range.getBoundingClientRect();
      
      // Improved positioning for mobile
      let xPos = rect.left + window.scrollX + (rect.width / 2);
      let yPos = rect.bottom + window.scrollY + 10;
      
      // Mobile adjustments
      if (isMobile) {
        // Keep menu within viewport bounds
        const viewportWidth = window.innerWidth;
        const menuWidth = 300; // Approximate menu width
        
        if (xPos + menuWidth / 2 > viewportWidth - 20) {
          xPos = viewportWidth - menuWidth / 2 - 20;
        }
        if (xPos - menuWidth / 2 < 20) {
          xPos = menuWidth / 2 + 20;
        }
        
        // Add extra space on mobile for easier touch interaction
        yPos += 10;
      }
      
      setSelectionMenu({
        paragraphId,
        start,
        end,
        text: selectedText,
        x: xPos,
        y: yPos
      });
      setQuestionInput('');
    }, delay);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        if (!window.getSelection().toString()) {
          setSelectionMenu(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAskQuestion = async (customQuestion = null) => {
    if (!selectionMenu) return;
    
    const { paragraphId, start, end, text } = selectionMenu;
    const question = customQuestion || questionInput || t.defaultPrompt;
    const annotationId = generateId();

    const newAnnotation = {
      id: annotationId,
      start,
      end,
      text,
      question,
      answer: "",
      isOpen: true,
      loading: true,
      hasError: false,
      retryData: null
    };

    setAnnotations(prev => ({
      ...prev,
      [paragraphId]: [...(prev[paragraphId] || []), newAnnotation]
    }));
    setSelectionMenu(null);
    window.getSelection().removeAllRanges();

    const prompt = `Selected text: "${text}".\nUser question/request: "${question}"\nContextualize this and directly answer. Do not use Markdown formats, use plain text.`;
    
    // Dil parametresi API fonksiyonuna gönderiliyor
    try {
      const result = await callAI(prompt, lang);

      setAnnotations(prev => {
        const paragraphAnns = prev[paragraphId] || [];
        const updatedAnns = paragraphAnns.map(ann => 
          ann.id === annotationId ? { 
            ...ann, 
            answer: result.text, 
            sources: result.sources, 
            loading: false,
            hasError: false,
            retryData: null
          } : ann
        );
        return { ...prev, [paragraphId]: updatedAnns };
      });
    } catch (error) {
      console.error("Gemini API hatası:", error);
      setAnnotations(prev => {
        const paragraphAnns = prev[paragraphId] || [];
        const updatedAnns = paragraphAnns.map(ann => 
          ann.id === annotationId ? { 
            ...ann, 
            answer: `${translations[lang].aiRequestFailed} ${error.message}`, 
            sources: [], 
            loading: false,
            hasError: true,
            retryData: { prompt, lang, paragraphId, annotationId }
          } : ann
        );
        return { ...prev, [paragraphId]: updatedAnns };
      });
    }
  };

  // AI retry function
  const retryAIRequest = async (paragraphId, annotationId, prompt, langCode) => {
    // Set loading state
    setAnnotations(prev => {
      const paragraphAnns = prev[paragraphId] || [];
      const updatedAnns = paragraphAnns.map(ann => 
        ann.id === annotationId ? { ...ann, loading: true, hasError: false } : ann
      );
      return { ...prev, [paragraphId]: updatedAnns };
    });

    try {
      const result = await callAI(prompt, langCode);
      
      setAnnotations(prev => {
        const paragraphAnns = prev[paragraphId] || [];
        const updatedAnns = paragraphAnns.map(ann => 
          ann.id === annotationId ? { 
            ...ann, 
            answer: result.text, 
            sources: result.sources, 
            loading: false,
            hasError: false,
            retryData: null
          } : ann
        );
        return { ...prev, [paragraphId]: updatedAnns };
      });
    } catch (error) {
      console.error("AI retry hatası:", error);
      setAnnotations(prev => {
        const paragraphAnns = prev[paragraphId] || [];
        const updatedAnns = paragraphAnns.map(ann => 
          ann.id === annotationId ? { 
            ...ann, 
            answer: `${translations[lang].aiRequestFailedRetry} ${error.message}`, 
            sources: [], 
            loading: false,
            hasError: true,
            retryData: { prompt, lang: langCode, paragraphId, annotationId }
          } : ann
        );
        return { ...prev, [paragraphId]: updatedAnns };
      });
    }
  };

  const toggleAnnotation = (paragraphId, annotationId) => {
    setAnnotations(prev => {
      const paragraphAnns = prev[paragraphId] || [];
      const updatedAnns = paragraphAnns.map(ann => 
        ann.id === annotationId ? { ...ann, isOpen: !ann.isOpen } : ann
      );
      return { ...prev, [paragraphId]: updatedAnns };
    });
  };

  const deleteAnnotation = (paragraphId, annotationId) => {
    setAnnotations(prev => {
      const paragraphAnns = prev[paragraphId] || [];
      const updatedAnns = paragraphAnns.filter(ann => ann.id !== annotationId);
      return { ...prev, [paragraphId]: updatedAnns };
    });
  };

  const renderParagraph = (paragraph) => {
    const paragraphAnns = annotations[paragraph.id] || [];
    
    // Tablo elementini özel olarak işle
    if (paragraph.type === 'table') {
      return (
        <div 
          className="table-container my-4 overflow-x-auto border border-slate-200 rounded-lg"
          dangerouslySetInnerHTML={{ __html: paragraph.html }}
          style={{
            maxWidth: '100%',
          }}
        />
      );
    }
    
    if (paragraphAnns.length === 0) {
      return <span>{paragraph.text}</span>;
    }

    const sorted = [...paragraphAnns].sort((a, b) => a.start - b.start);
    const elements = [];
    let currentIndex = 0;

    sorted.forEach((ann) => {
      if (ann.start > currentIndex) {
        elements.push(<span key={`text-${currentIndex}`}>{paragraph.text.slice(currentIndex, ann.start)}</span>);
      }

      elements.push(
        <span key={`ann-${ann.id}`} className="relative inline">
          <mark 
            onClick={() => toggleAnnotation(paragraph.id, ann.id)}
            className={`cursor-pointer rounded px-1 transition-all duration-200 border-b-2 
              ${ann.isOpen 
                ? 'bg-indigo-200 border-indigo-400 text-indigo-900' 
                : 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-slate-800'}`}
          >
            {paragraph.text.slice(ann.start, ann.end)}
          </mark>

          {ann.isOpen && (
            <span 
              contentEditable={false} 
              className="block w-full sm:max-w-[90%] md:max-w-2xl mt-4 mb-6 ml-2 sm:ml-4 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden font-sans text-base leading-relaxed text-slate-800 z-10 animate-in fade-in slide-in-from-top-2 relative"
            >
              <span className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 border-b border-slate-100 px-5 py-3 gap-3 sm:gap-0">
                <span className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                    <Search size={16} />
                  </span>
                  <span className="font-semibold text-slate-700 text-sm">
                    "{ann.text}" <span className="text-slate-400 font-normal hidden sm:inline">{t.about}</span>
                  </span>
                </span>
                <span className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-500 shadow-sm max-w-[200px] truncate">
                    {ann.question}
                  </span>
                  <button onClick={() => toggleAnnotation(paragraph.id, ann.id)} className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={16} />
                  </button>
                </span>
              </span>
              
              <span className="block p-5 sm:p-6 bg-white">
                {ann.loading ? (
                  <span className="flex flex-col items-center justify-center py-6 gap-3 text-slate-400">
                    <Loader2 className="animate-spin text-indigo-500" size={28} />
                    <span className="text-sm font-medium animate-pulse">{t.loadingAI}</span>
                  </span>
                ) : (
                  <span className="block">
                    <span className="flex gap-3 items-start">
                      {ann.hasError ? (
                        <X className="text-red-500 flex-shrink-0 mt-1" size={20} />
                      ) : (
                        <Sparkles className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                      )}
                      <span className="whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px]">
                        {ann.answer}
                      </span>
                    </span>

                    {/* Kaynaklar Bölümü */}
                    {ann.sources && ann.sources.length > 0 && (
                      <span className="block mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Globe size={12} />
                          {t.sourcesTitle}
                        </span>
                        <span className="flex flex-col gap-1.5">
                          {ann.sources.map((source, idx) => (
                            <a 
                              key={idx} 
                              href={source.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[13px] text-indigo-500 hover:text-indigo-700 hover:underline flex items-center gap-2 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/50 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 flex-shrink-0"></span>
                              <span className="truncate">{source.title}</span>
                            </a>
                          ))}
                        </span>
                      </span>
                    )}

                    <span className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <div className="flex gap-2">
                        {ann.hasError && ann.retryData && (
                          <button 
                            onClick={() => retryAIRequest(
                              ann.retryData.paragraphId, 
                              ann.retryData.annotationId, 
                              ann.retryData.prompt, 
                              ann.retryData.lang
                            )}
                            className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors font-medium flex items-center gap-1"
                            disabled={ann.loading}
                          >
                            {ann.loading ? <Loader2 size={12} className="animate-spin" /> : '🔄'} {t.retryBtn}
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteAnnotation(paragraph.id, ann.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                      >
                        {t.deleteNote}
                      </button>
                    </span>
                  </span>
                )}
              </span>
            </span>
          )}
        </span>
      );
      
      currentIndex = ann.end;
    });

    if (currentIndex < paragraph.text.length) {
      elements.push(<span key={`text-${currentIndex}`}>{paragraph.text.slice(currentIndex)}</span>);
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Sidebar Toggle for Mobile/Desktop */}
            <button
              onClick={() => setShowSidebar(prev => !prev)}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 p-2 rounded-lg ${
                showSidebar ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
              title={t.documents}
            >
              <Menu size={16} />
            </button>
            
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-indigo-200">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">DocuWeb Explorer</h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Kaydetme Durumu */}
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {saveStatus === 'saving' && <><Loader2 size={14} className="animate-spin text-indigo-500" /><span className="text-slate-400 hidden sm:inline">Kaydediliyor...</span></>}
              {saveStatus === 'saved' && <><Cloud size={14} className="text-green-500" /><span className="text-green-500 hidden sm:inline">Kaydedildi</span></>}
              {saveStatus === 'demo' && <><Sparkles size={14} className="text-amber-500" /><span className="text-amber-500 hidden sm:inline">{t.demoMode}</span></>}
              {saveStatus === 'error' && <><CloudOff size={14} className="text-red-500" /><span className="text-red-400 hidden sm:inline">Hata</span></>}
            </div>

            {/* Dil Seçici Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <Globe size={18} />
                <span className="hidden sm:inline">{lang.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button onClick={() => { 
                  setLang('tr'); 
                  localStorage.setItem('app_language', 'tr'); 
                  trackUserAction('language_changed', { new_language: 'tr', previous_language: lang });
                }} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'tr' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>Türkçe</button>
                <button onClick={() => { 
                  setLang('en'); 
                  localStorage.setItem('app_language', 'en'); 
                  trackUserAction('language_changed', { new_language: 'en', previous_language: lang });
                }} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'en' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>English</button>
                <button onClick={() => { 
                  setLang('de'); 
                  localStorage.setItem('app_language', 'de'); 
                  trackUserAction('language_changed', { new_language: 'de', previous_language: lang });
                }} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'de' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>Deutsch</button>
              </div>
            </div>

            {/* İçe Aktar Butonu (Her zaman görünür) */}
            <label className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm">
              <FolderOpen size={16} />
              <span className="hidden sm:inline">{t.importBtn}</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            {paragraphs.length > 0 && (
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">{t.exportBtn}</span>
                  <ChevronRight size={14} className={`transition-transform ${showExportMenu ? 'rotate-90' : ''}`} />
                </button>

                {showExportMenu && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleExport();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileText size={16} />
                        {t.exportSession}
                        <span className="text-xs text-slate-400 ml-auto">JSON</span>
                      </button>
                      
                      <hr className="my-1 border-slate-100" />
                      
                      <div className="px-3 py-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          {t.exportNotes}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          exportNotes('markdown');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileText size={16} />
                        {t.exportNotesMarkdown}
                      </button>

                      <button
                        onClick={() => {
                          exportNotes('html');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Globe size={16} />
                        {t.exportNotesHtml}
                      </button>

                      <button
                        onClick={() => {
                          exportNotes('json');
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <FileText size={16} />
                        {t.exportNotesJson}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
                        {/* Session Export */}
                        <button
                          onClick={() => {
                            handleExport();
                            setShowExportMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText size={16} />
                          {t.exportSession}
                          <span className="text-xs text-slate-400 ml-auto">JSON</span>
                        </button>

                        <hr className="my-1 border-slate-100" />

                        {/* Notes Export Options */}
                        <div className="px-3 py-1">
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {t.exportNotes}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            exportNotes('markdown');
                            setShowExportMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText size={16} />
                          {t.exportNotesMarkdown}
                        </button>

                        <button
                          onClick={() => {
                            exportNotes('html');
                            setShowExportMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <Globe size={16} />
                          {t.exportNotesHtml}
                        </button>

                        <button
                          onClick={() => {
                            exportNotes('json');
                            setShowExportMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <FileText size={16} />
                          {t.exportNotesJson}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
            )}

            {/* Yeni Belge Butonu */}
                <button 
                  onClick={handleNewDocument}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">{t.newDoc}</span>
                </button>
            )}

            {/* Döküman Geçmişi Butonu */}
            <button
              onClick={() => setShowHistory(prev => !prev)}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 p-2 rounded-lg ${showHistory ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
              title="Döküman Geçmişi"
            >
              <History size={16} />
            </button>

            {/* Çıkış Yap Butonu */}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5 p-2 rounded-lg hover:bg-red-50"
              title="Çıkış Yap"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      {isGuestMode && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 text-center text-sm font-medium shadow-lg animate-in slide-in-from-top-2">
          <div className="max-w-5xl mx-auto flex items-center justify-center gap-2">
            <Sparkles size={16} className="flex-shrink-0" />
            <span>
              <strong>Demo Mode:</strong> Try all features! Data won't be saved. {' '}
              <button 
                onClick={() => window.location.reload()} 
                className="underline hover:no-underline font-semibold"
              >
                Sign up to save your work
              </button>
            </span>
          </div>
        </div>
      )}

      {/* Döküman Geçmişi Paneli - Kaldırılacak çünkü sidebar'a taşınacak */}
      {showHistory && (
        <div className="bg-white border-b border-slate-200 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <History size={16} className="text-indigo-500" />
                Döküman Geçmişi (Geçici - Sidebar'a taşınacak)
              </h3>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded">
                <X size={16} />
              </button>
            </div>
            
            {loadingHistory ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-4 justify-center">
                <Loader2 size={16} className="animate-spin" /> Yükleniyor...
              </div>
            ) : sessionList.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">Henüz kaydedilmiş döküman yok.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {sessionList.map((s) => (
                  <div
                    key={s.id}
                    className={`group flex items-center justify-between gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                      sessionId === s.id
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-slate-50 border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 text-slate-700'
                    }`}
                    onClick={() => loadSessionById(s.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {s.document_title || t.untitled}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(s.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1 rounded"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area with Sidebar */}
      <div className="flex h-screen">
        {/* Documents Sidebar */}
        {showSidebar && (
          <>
            {/* Overlay for mobile */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={() => setShowSidebar(false)}
            />
            
            {/* Sidebar */}
            <aside className={`
              fixed md:sticky top-0 left-0 z-50 md:z-auto
              w-80 h-screen bg-white border-r border-slate-200 shadow-xl md:shadow-none
              flex flex-col
              ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
              transition-transform duration-300 ease-in-out md:translate-x-0
            `}>
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-500" />
                  {t.documents}
                </h3>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded md:hidden"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Enhanced Search and Filter */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative mb-3">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={sidebarSearch}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
                      showAdvancedSearch ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Advanced search"
                  >
                    <Filter size={16} />
                  </button>
                </div>

                {/* Advanced Search Options */}
                {showAdvancedSearch && (
                  <div className="mb-3 p-3 bg-slate-50 rounded-lg border space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Search in:</label>
                        <select
                          value={searchFilters.searchIn}
                          onChange={(e) => handleFilterChange('searchIn', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                        >
                          <option value="all">All content</option>
                          <option value="title">Title only</option>
                          <option value="content">Document text</option>
                          <option value="annotations">Annotations</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Language:</label>
                        <select
                          value={searchFilters.language}
                          onChange={(e) => handleFilterChange('language', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                        >
                          <option value="any">Any language</option>
                          <option value="en">English</option>
                          <option value="tr">Türkçe</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Date:</label>
                        <select
                          value={searchFilters.dateRange}
                          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                        >
                          <option value="any">Any date</option>
                          <option value="today">Today</option>
                          <option value="week">This week</option>
                          <option value="month">This month</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">Annotations:</label>
                        <select
                          value={searchFilters.annotated}
                          onChange={(e) => handleFilterChange('annotated', e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded px-2 py-1"
                        >
                          <option value="any">Any</option>
                          <option value="yes">With annotations</option>
                          <option value="no">Without annotations</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowRecentOnly(prev => !prev);
                      trackUserAction('filter_recent_toggled', { recent_only: !showRecentOnly });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      showRecentOnly 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Filter size={12} />
                    {showRecentOnly ? t.recent : t.all}
                  </button>
                  <button
                    onClick={() => {
                      loadSessionList();
                      trackUserAction('refresh_documents_clicked', {});
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                    disabled={loadingHistory}
                  >
                    {loadingHistory ? <Loader2 size={12} className="animate-spin" /> : <History size={12} />}
                    {t.refresh}
                  </button>
                </div>
              </div>

              {/* Documents List */}
              <div className="flex-1 overflow-y-auto">
                {loadingHistory ? (
                  <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                    <Loader2 size={24} className="animate-spin mb-2" />
                    <span className="text-sm">{t.loadingDocs}</span>
                  </div>
                ) : (
                  (() => {
                    let filteredList = sessionList;
                    
                    // Apply advanced search filters
                    filteredList = performAdvancedSearch(filteredList, sidebarSearch, searchFilters);
                    
                    // Recent filter
                    if (showRecentOnly) {
                      filteredList = filteredList.slice(0, 10);
                    }
                    
                    return filteredList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                        <FileText size={24} className="mb-2 opacity-50" />
                        <span className="text-sm text-center px-4">
                          {sidebarSearch || Object.values(searchFilters).some(f => f !== 'any') ? t.noSearchResults : t.noDocs}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2">
                        {filteredList.map((s) => (
                          <div
                            key={s.id}
                            className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all mb-2 ${
                              sessionId === s.id
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                : 'border-transparent hover:bg-slate-50 text-slate-700'
                            }`}
                            onClick={() => {
                              loadSessionById(s.id);
                              if (window.innerWidth < 768) setShowSidebar(false); // Close on mobile
                              trackUserAction('document_opened', { 
                                document_id: s.id,
                                title: s.document_title,
                                from_search: !!sidebarSearch
                              });
                            }}
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <FileText size={14} className="text-slate-500" />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold truncate">
                                {s.document_title || t.untitled}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs text-slate-400">
                                  {new Date(s.updated_at).toLocaleDateString('tr-TR', { 
                                    day: 'numeric', 
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {s.lang && (
                                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                                    {s.lang.toUpperCase()}
                                  </span>
                                )}
                                {/* Show annotation count if available */}
                                {s.annotations && Object.keys(s.annotations).length > 0 && (
                                  <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
                                    {Object.values(s.annotations).reduce((total, anns) => total + anns.length, 0)} notes
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                deleteSession(s.id); 
                                trackUserAction('document_deleted', { 
                                  document_id: s.id,
                                  title: s.document_title
                                });
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50"
                              title="Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })()
                )}
              </div>

              {/* Sidebar Footer */}
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={handleNewDocument}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Plus size={16} />
                  {t.newDoc}
                </button>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="max-w-4xl mx-auto px-4 py-8 pb-32">
            
            {paragraphs.length === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mt-10">
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 text-center max-w-2xl mx-auto">
                  <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Upload size={40} className="text-indigo-500" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-slate-800">{t.uploadTitle}</h2>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                    {t.uploadDesc}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <label className={`relative cursor-pointer ${isReadingFile ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 group w-full sm:w-auto justify-center`}>
                      {isReadingFile ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />}
                      {isReadingFile ? t.reading : t.selectFile}
                      <input type="file" accept=".txt,.docx,.odt" onChange={handleFileUpload} className="hidden" disabled={isReadingFile} />
                    </label>
                    
                    <span className="text-slate-400 font-medium">{t.or}</span>
                    
                    <button 
                      onClick={loadDemo}
                      className="bg-white border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 text-slate-600 px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                      <Sparkles size={20} />
                      {t.demoBtn}
                    </button>
                  </div>
                  
                  {errorMsg && (
                    <div className="mt-6 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium animate-in fade-in zoom-in-95">
                      {errorMsg}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                  {[
                    { title: t.step1Title, desc: t.step1Desc },
                    { title: t.step2Title, desc: t.step2Desc },
                    { title: t.step3Title, desc: t.step3Desc }
                  ].map((step, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center mx-auto mb-3">{i+1}</div>
                      <h3 className="font-semibold text-slate-800 mb-1">{step.title}</h3>
                      <p className="text-sm text-slate-500">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {paragraphs.length > 0 && (
              <div className="animate-in fade-in duration-700">
                {/* Document Header Controls */}
                <div className="flex items-center justify-between mb-6 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <select
                      value={lang}
                      onChange={(e) => {
                        setLang(e.target.value);
                        localStorage.setItem('app_language', e.target.value);
                      }}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="tr">🇹🇷 Türkçe</option>
                      <option value="en">🇺🇸 English</option>
                      <option value="de">🇩🇪 Deutsch</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Tutorial Button */}
                    <button
                      onClick={() => setShowTutorial(true)}
                      className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation"
                    >
                      <HelpCircle size={16} />
                      <span className="hidden sm:inline">{t.tutorialTitle}</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl mb-10 text-indigo-800 text-sm">
                  <Info className="flex-shrink-0 text-indigo-500 mt-0.5" size={20} />
                  <div>
                    <strong className="font-semibold block mb-1">{t.guideTitle}</strong>
                    {t.guideDesc} <strong>{t.guideStrong}</strong> {t.guideEnd}
                  </div>
                </div>

                <article 
                  className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 px-6 py-10 sm:px-12 sm:py-16 mx-auto relative font-serif text-lg leading-loose text-slate-800"
                  onMouseUp={handleMouseUp}
                  onTouchEnd={handleMouseUp}
                >
                  <h1 className="text-3xl sm:text-5xl font-black font-sans text-slate-900 mb-12 pb-8 border-b border-slate-100 tracking-tight">
                    {documentTitle || t.untitled}
                  </h1>

                  <div className="flex flex-col">
                    {paragraphs.map((p) => {
                      let blockClass = "paragraph-block relative ";
                      
                      switch(p.type) {
                          case 'h1': blockClass += "text-3xl sm:text-4xl font-black text-slate-900 mt-12 mb-6 font-sans tracking-tight"; break;
                          case 'h2': blockClass += "text-2xl sm:text-3xl font-bold text-slate-800 mt-10 mb-4 font-sans tracking-tight border-b border-slate-100 pb-2"; break;
                          case 'h3':
                          case 'h4':
                          case 'h5':
                          case 'h6': blockClass += "text-xl sm:text-2xl font-bold text-slate-800 mt-8 mb-3 font-sans"; break;
                          case 'li': blockClass += "text-lg leading-relaxed text-slate-700 ml-8 list-item list-disc marker:text-indigo-500 mb-2"; break;
                          default: blockClass += "text-lg leading-relaxed text-slate-700 mb-5";
                      }

                      return (
                        <div key={p.id} data-id={p.id} className={blockClass}>
                          {renderParagraph(p)}
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            )}
            
          </main>
        </div>
      </div>

      {selectionMenu && (
        <div 
          ref={menuRef}
          className="absolute z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-2 sm:p-3 animate-in zoom-in-95 fade-in slide-in-from-bottom-2 flex flex-col gap-2 border border-slate-700"
          style={{
            left: `${Math.max(10, selectionMenu.x - 150)}px`,
            top: `${selectionMenu.y}px`,
            width: 'max-content',
            maxWidth: '90vw'
          }}
        >
          <div className="flex items-center justify-between gap-4 px-2 pt-1">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare size={12} />
              {t.askQ}
            </span>
            <button onClick={() => setSelectionMenu(null)} className="text-slate-500 hover:text-white transition-colors p-1 touch-manipulation">
              <X size={14} />
            </button>
          </div>
          
          <div className="flex bg-slate-800 rounded-lg border border-slate-700 focus-within:border-indigo-500 transition-colors p-1">
            <input 
              type="text" 
              autoFocus
              placeholder={t.placeholder}
              className="bg-transparent border-none outline-none text-sm px-3 py-1.5 w-full sm:w-64 text-white placeholder:text-slate-500"
              value={questionInput}
              onChange={(e) => setQuestionInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            />
            <button 
              onClick={() => handleAskQuestion()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md transition-colors flex items-center justify-center group touch-manipulation"
            >
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex gap-2 px-1 mt-1">
            <button 
              onClick={() => handleAskQuestion(t.explainPrompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 px-3 sm:py-1.5 rounded-full text-slate-300 transition-colors touch-manipulation"
            >
              {t.explainBtn}
            </button>
            <button 
              onClick={() => handleAskQuestion(t.simplifyPrompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 py-2 px-3 sm:py-1.5 rounded-full text-slate-300 transition-colors touch-manipulation"
            >
              {t.simplifyBtn}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Annotation Helper - Shows on small screens */}
      <button
        onClick={() => setShowMobileAnnotate(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-lg z-40 touch-manipulation transition-all hover:scale-105 md:hidden"
        title={t.mobileAnnotateBtn}
      >
        <MessageSquare size={20} />
      </button>

      {/* Mobile Annotation Dialog */}
      {showMobileAnnotate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {t.mobileAnnotateTitle || "Add Annotation"}
              </h3>
              <button
                onClick={() => setShowMobileAnnotate(false)}
                className="text-slate-400 hover:text-slate-600 p-1 touch-manipulation"
              >
                <X size={20} />
              </button>
            </div>
            <div className="text-sm text-slate-600 mb-4">
              {t.mobileAnnotateDesc || "To add annotations on mobile, first select text by double-tapping and dragging, then use the popup menu that appears."}
            </div>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowMobileAnnotate(false);
                  // Scroll to the beginning of the document to help user start
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-medium touch-manipulation"
              >
                {t.mobileAnnotateStart || "Got it, start annotating"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tutorial */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                {t.tutorialTitle || `Tutorial ${tutorialStep + 1}/3`}
              </h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-slate-400 hover:text-slate-600 p-1 touch-manipulation"
              >
                <X size={20} />
              </button>
            </div>
            
            {tutorialStep === 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">👆</div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-2">{t.step1Title}</h4>
                  <p className="text-slate-600">{t.step1Desc}</p>
                </div>
              </div>
            )}
            
            {tutorialStep === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-2">{t.step2Title}</h4>
                  <p className="text-slate-600">{t.step2Desc}</p>
                </div>
              </div>
            )}
            
            {tutorialStep === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h4 className="font-semibold text-lg text-slate-900 mb-2">{t.step3Title}</h4>
                  <p className="text-slate-600">{t.step3Desc}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex space-x-2">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${step === tutorialStep ? 'bg-indigo-600' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
              <div className="flex space-x-2">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                  >
                    {t.prevBtn || "Previous"}
                  </button>
                )}
                {tutorialStep < 2 ? (
                  <button
                    onClick={() => setTutorialStep(tutorialStep + 1)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                  >
                    {t.nextBtn || "Next"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                  >
                    {t.finishBtn || "Finish"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}