import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabaseClient.js';
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
  Plus
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
    sourcesTitle: "Kaynaklar"
  },
  en: {
    subtitle: "Turn Text into a Living Website",
    newDoc: "New Document",
    exportBtn: "Export",
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
    sourcesTitle: "Sources"
  },
  de: {
    subtitle: "Verwandle Text in eine lebendige Website",
    newDoc: "Neues Dokument",
    exportBtn: "Exportieren",
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
    sourcesTitle: "Quellen"
  }
};

// --- AI PROVIDER SİSTEMİ (Fallback Destekli) ---

// Gemini API çağrısı
const callGemini = async (prompt, systemPromptText) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemPromptText }] },
    tools: [{ google_search: {} }]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (response.status === 429) return null; // Kota doldu → fallback'e geç
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);

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

// OpenAI-uyumlu API çağrısı (DeepSeek, Groq, Ollama vb.)
const callOpenAICompatible = async (prompt, systemPromptText, baseUrl, apiKey, model) => {
  if (!apiKey && !baseUrl.includes('localhost')) return null;

  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPromptText },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (response.status === 429) return null;
  if (!response.ok) throw new Error(`${model} HTTP ${response.status}`);

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "Yanıt alınamadı.";
  return { text, sources: [] };
};

// HuggingFace Inference API çağrısı (Llama 3.3 70B via Together)
const callHuggingFace = async (prompt, systemPromptText) => {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(
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

  if (response.status === 429 || response.status === 503) return null;
  if (!response.ok) throw new Error(`HuggingFace HTTP ${response.status}`);

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "Yanıt alınamadı.";
  return { text, sources: [] };
};

// Ana AI çağrı fonksiyonu — sırayla dener, ilk çalışanı kullanır
const callAI = async (prompt, langCode = 'tr') => {
  const langName = translations[langCode].langName;
  const systemPromptText = translations[langCode].aiSystem.replace("{LANG}", langName);

  const providers = [
    // 1. Gemini (birincil)
    () => callGemini(prompt, systemPromptText),
    // 2. HuggingFace (ücretsiz, Llama 3.3 70B)
    () => callHuggingFace(prompt, systemPromptText),
  ];

  for (const provider of providers) {
    try {
      const result = await provider();
      if (result) return result;
    } catch (err) {
      console.warn('Provider hatası, sonrakine geçiliyor:', err.message);
    }
  }

  return { text: "Tüm AI servisleri şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.", sources: [] };
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

// --- ANA BİLEŞEN ---

export default function App() {
  const [lang, setLang] = useState('tr');
  const t = translations[lang];

  const [documentTitle, setDocumentTitle] = useState('');
  const [paragraphs, setParagraphs] = useState([]);
  const [annotations, setAnnotations] = useState({}); 
  const [selectionMenu, setSelectionMenu] = useState(null); 
  const [questionInput, setQuestionInput] = useState('');
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const [sessionId, setSessionId] = useState(null);
  const [sessionList, setSessionList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const menuRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  // --- Supabase: Oturum Yükleme ---
  useEffect(() => {
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
        setLang(data.lang || 'tr');
      }
    };
    loadSession();
  }, []);

  // --- Supabase: Otomatik Kaydetme ---
  const saveToSupabase = useCallback(async (title, paras, anns, currentLang) => {
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
  }, [sessionId]);

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

  // Geçmiş paneli açıldığında listeyi yükle
  useEffect(() => {
    if (showHistory) loadSessionList();
  }, [showHistory]);

  // --- Döküman Geçmişi: Oturum Yükle ---
  const loadSessionById = async (id) => {
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
      setLang(data.lang || 'tr');
      setShowHistory(false);
    }
  };

  // --- Döküman Geçmişi: Oturum Sil ---
  const deleteSession = async (id) => {
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
          alert(t.importErr);
        }
      } catch (err) {
        alert(t.importErr);
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

  // Dosya Yükleme İşlemi
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
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
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const walk = (node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li'].includes(tag)) {
                    const text = node.textContent.trim();
                    if (text) parsedParagraphs.push({ id: generateId(), type: tag, text });
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
            el.nodeName === 'text:h' || el.nodeName === 'text:p'
        );
        
        elements.forEach(el => {
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
      } else {
        setErrorMsg(t.errType);
        setIsReadingFile(false);
        return;
      }

      if (parsedParagraphs.length === 0) {
        setErrorMsg(t.errEmpty);
      } else {
        setParagraphs(parsedParagraphs);
      }
    } catch (error) {
      console.error("Dosya okuma hatası:", error);
      setErrorMsg(t.errRead);
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleMouseUp = () => {
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
      
      setSelectionMenu({
        paragraphId,
        start,
        end,
        text: selectedText,
        x: rect.left + window.scrollX + (rect.width / 2),
        y: rect.bottom + window.scrollY + 10
      });
      setQuestionInput('');
    }, 50);
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
      loading: true
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
          ann.id === annotationId ? { ...ann, answer: result.text, sources: result.sources, loading: false } : ann
        );
        return { ...prev, [paragraphId]: updatedAnns };
      });
    } catch (error) {
      console.error("Gemini API hatası:", error);
      setAnnotations(prev => {
        const paragraphAnns = prev[paragraphId] || [];
        const updatedAnns = paragraphAnns.map(ann => 
          ann.id === annotationId ? { ...ann, answer: `Hata: ${error.message}`, sources: [], loading: false } : ann
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
                      <Sparkles className="text-amber-500 flex-shrink-0 mt-1" size={20} />
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

                    <span className="flex justify-end mt-4 pt-4 border-t border-slate-100">
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
              {saveStatus === 'error' && <><CloudOff size={14} className="text-red-500" /><span className="text-red-400 hidden sm:inline">Hata</span></>}
            </div>

            {/* Dil Seçici Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                <Globe size={18} />
                <span className="hidden sm:inline">{lang.toUpperCase()}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                <button onClick={() => setLang('tr')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'tr' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>Türkçe</button>
                <button onClick={() => setLang('en')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'en' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>English</button>
                <button onClick={() => setLang('de')} className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors ${lang === 'de' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600'}`}>Deutsch</button>
              </div>
            </div>

            {/* İçe Aktar Butonu (Her zaman görünür) */}
            <label className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm">
              <FolderOpen size={16} />
              <span className="hidden sm:inline">{t.importBtn}</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            {paragraphs.length > 0 && (
              <>
                {/* Dışa Aktar Butonu (Sadece doküman varken) */}
                <button 
                  onClick={handleExport}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-lg shadow-sm"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">{t.exportBtn}</span>
                </button>

                {/* Yeni Belge Butonu */}
                <button 
                  onClick={handleNewDocument}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5 bg-slate-100 hover:bg-red-50 px-3 py-1.5 rounded-lg"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">{t.newDoc}</span>
                </button>
              </>
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

      {/* Döküman Geçmişi Paneli */}
      {showHistory && (
        <div className="bg-white border-b border-slate-200 shadow-sm animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <History size={16} className="text-indigo-500" />
                Döküman Geçmişi
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
                        {s.document_title || 'İsimsiz Belge'}
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
            <button onClick={() => setSelectionMenu(null)} className="text-slate-500 hover:text-white transition-colors">
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
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-md transition-colors flex items-center justify-center group"
            >
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex gap-2 px-1 mt-1">
            <button 
              onClick={() => handleAskQuestion(t.explainPrompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 py-1.5 px-3 rounded-full text-slate-300 transition-colors"
            >
              {t.explainBtn}
            </button>
            <button 
              onClick={() => handleAskQuestion(t.simplifyPrompt)}
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 py-1.5 px-3 rounded-full text-slate-300 transition-colors"
            >
              {t.simplifyBtn}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}