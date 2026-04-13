import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { supabase } from './supabaseClient.js'

const authTranslations = {
  en: {
    login: 'Sign In',
    register: 'Create Account',
    emailPlaceholder: 'Email address',
    passwordPlaceholder: 'Password (min. 6 characters)',
    loginBtn: 'Sign In',
    registerBtn: 'Sign Up',
    noAccount: "Don't have an account? ",
    hasAccount: 'Already have an account? ',
    switchToRegister: 'Sign Up',
    switchToLogin: 'Sign In',
    registerSuccess: 'Registration successful! Check your email and click the verification link.',
    demoBtn: 'Try Demo',
    demoText: 'Experience without signup',
    or: 'or'
  },
   de: {
    login: 'Anmelden',
    register: 'Konto erstellen',
    emailPlaceholder: 'E-Mail-Adresse',
    passwordPlaceholder: 'Passwort (min. 6 Zeichen)',
    loginBtn: 'Anmelden',
    registerBtn: 'Registrieren',
    noAccount: 'Noch kein Konto? ',
    hasAccount: 'Bereits ein Konto? ',
    switchToRegister: 'Registrieren',
    switchToLogin: 'Anmelden',
    registerSuccess: 'Registrierung erfolgreich! Überprüfe deine E-Mail und klicke auf den Bestätigungslink.',
    demoBtn: 'Demo ausprobieren',
    demoText: 'Ohne Anmeldung testen',
    or: 'oder'
  },
  tr: {
    login: 'Giriş Yap',
    register: 'Hesap Oluştur',
    emailPlaceholder: 'E-posta adresi',
    passwordPlaceholder: 'Şifre (min. 6 karakter)',
    loginBtn: 'Giriş Yap',
    registerBtn: 'Kayıt Ol',
    noAccount: 'Hesabın yok mu? ',
    hasAccount: 'Zaten hesabın var mı? ',
    switchToRegister: 'Kayıt Ol',
    switchToLogin: 'Giriş Yap',
    registerSuccess: 'Kayıt başarılı! E-postanı kontrol et ve doğrulama linkine tıkla.',
    demoBtn: 'Demo Dene',
    demoText: 'Kayıt olmadan dene',
    or: 'veya'
  }
}

const langFlags = { en: 'EN', tr: '🇹🇷', de: '🇩🇪' }

function AuthGate({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_language') || 'en'
  })
  const [isGuestMode, setIsGuestMode] = useState(false)

  const t = authTranslations[lang]

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage(t.registerSuccess)
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleGuestMode = () => {
    setIsGuestMode(true)
  }

  if (loading) return null

  if (session || isGuestMode) return React.cloneElement(children, { isGuestMode })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '40px',
        maxWidth: '380px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative'
      }}>
        {/* Language Switcher */}
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px' }}>
          {Object.keys(authTranslations).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLang(l);
                localStorage.setItem('app_language', l);
              }}
              style={{
                background: lang === l ? '#334155' : 'transparent',
                border: lang === l ? '1px solid #6366f1' : '1px solid transparent',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '16px',
                cursor: 'pointer',
                opacity: lang === l ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
              title={l.toUpperCase()}
            >
              {langFlags[l]}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
        <h2 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: '20px' }}>
          {mode === 'login' ? t.login : t.register}
        </h2>
        <p style={{ color: '#94a3b8', margin: '0 0 24px', fontSize: '14px' }}>
          DocuWeb Explorer
        </p>

        {message && <p style={{ color: '#34d399', fontSize: '13px', margin: '0 0 12px', background: '#064e3b', padding: '8px', borderRadius: '6px' }}>{message}</p>}

        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder={t.emailPlaceholder}
          autoFocus
          required
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '8px',
            border: '1px solid #475569', background: '#0f172a', color: '#f1f5f9',
            fontSize: '16px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px'
          }}
        />
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          placeholder={t.passwordPlaceholder}
          required
          minLength={6}
          style={{
            width: '100%', padding: '12px 16px', borderRadius: '8px',
            border: '1px solid #475569', background: '#0f172a', color: '#f1f5f9',
            fontSize: '16px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px'
          }}
        />

        {error && <p style={{ color: '#f87171', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>}

        <button type="submit" disabled={submitting} style={{
          width: '100%', padding: '12px', borderRadius: '8px', border: 'none',
          background: submitting ? '#475569' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          color: 'white', fontSize: '15px', fontWeight: 600, cursor: submitting ? 'wait' : 'pointer'
        }}>
          {submitting ? '...' : mode === 'login' ? t.loginBtn : t.registerBtn}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#475569' }}></div>
          <span style={{ color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.or}</span>
          <div style={{ flex: 1, height: '1px', background: '#475569' }}></div>
        </div>

        <button 
          type="button"
          onClick={handleGuestMode}
          style={{
            width: '100%', 
            padding: '12px', 
            borderRadius: '8px', 
            border: '2px solid #475569',
            background: 'transparent',
            color: '#94a3b8', 
            fontSize: '15px', 
            fontWeight: 600, 
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.borderColor = '#6366f1'
            e.target.style.color = '#6366f1'
          }}
          onMouseOut={(e) => {
            e.target.style.borderColor = '#475569'
            e.target.style.color = '#94a3b8'
          }}
        >
          🚀 {t.demoBtn}
        </button>
        
        <p style={{ color: '#64748b', fontSize: '11px', marginTop: '8px', textAlign: 'center' }}>
          {t.demoText}
        </p>

        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
          {mode === 'login' ? t.noAccount : t.hasAccount}
          <span
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
            style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? t.switchToRegister : t.switchToLogin}
          </span>
        </p>
      </form>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
  </React.StrictMode>,
)
