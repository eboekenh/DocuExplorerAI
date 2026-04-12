import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { supabase } from './supabaseClient.js'

function AuthGate({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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
        setMessage('Kayıt başarılı! E-postanı kontrol et ve doğrulama linkine tıkla.')
        setMode('login')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  if (session) return children

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
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔐</div>
        <h2 style={{ color: '#f1f5f9', margin: '0 0 8px', fontSize: '20px' }}>
          {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
        </h2>
        <p style={{ color: '#94a3b8', margin: '0 0 24px', fontSize: '14px' }}>
          DocuWeb Explorer
        </p>

        {message && <p style={{ color: '#34d399', fontSize: '13px', margin: '0 0 12px', background: '#064e3b', padding: '8px', borderRadius: '6px' }}>{message}</p>}

        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError('') }}
          placeholder="E-posta adresi"
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
          placeholder="Şifre (min. 6 karakter)"
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
          {submitting ? '...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>

        <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
          {mode === 'login' ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
          <span
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
            style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
          >
            {mode === 'login' ? 'Kayıt Ol' : 'Giriş Yap'}
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
