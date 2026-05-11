'use client'

import { useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  async function handleLogin() {
    if (!email || !password) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Invalid email or password.')
      setLoading(false)
    } else {
      router.push('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <p className="font-cond tracking-widest text-lg mb-1">
            <span className="font-semibold text-gold-light">K.P_PHO</span>
            <span className="font-light text-paper/70">TOGraph</span>
          </p>
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-muted">
            Admin Access
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="kp@example.com"
              className="w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3.5 focus:outline-none focus:border-gold transition-colors duration-200"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div className="space-y-2">
            <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3.5 focus:outline-none focus:border-gold transition-colors duration-200"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          {error && (
            <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center font-cond text-[0.6rem] tracking-widest uppercase text-muted/40 mt-10">
          K.P_PHOTOGraph © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}