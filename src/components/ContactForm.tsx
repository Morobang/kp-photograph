'use client'

import { useState } from 'react'

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', service: '', message: '',
  })

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  async function handleSubmit() {
    if (!form.first_name || !form.email || !form.service || !form.message) return
    setState('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setState('success')
      setForm({ first_name: '', last_name: '', email: '', service: '', message: '' })
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="block w-8 h-px bg-gold" />
          <span className="font-cond text-xs tracking-[0.2em] uppercase text-gold">Sent</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-paper font-bold">Got it — K.P will be in touch.</h3>
        <p className="text-muted font-light text-sm leading-relaxed max-w-sm">
          Your enquiry has been received. Expect a reply within 24–48 hours, usually sooner.
        </p>
        <button
          onClick={() => setState('idle')}
          className="mt-4 font-cond text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300"
        >
          Send Another
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name">
          <input
            type="text"
            placeholder="Thabo"
            value={form.first_name}
            onChange={e => update('first_name', e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Last Name">
          <input
            type="text"
            placeholder="Mokoena"
            value={form.last_name}
            onChange={e => update('last_name', e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Email">
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => update('email', e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Service">
        <select
          value={form.service}
          onChange={e => update('service', e.target.value)}
          className={`${inputClass} appearance-none`}
        >
          <option value="">— Select a package —</option>
          <option value="Portrait Session">Portrait Session</option>
          <option value="Event Coverage">Event Coverage</option>
          <option value="Editorial & Commercial">Editorial & Commercial</option>
          <option value="Other / Custom">Other / Custom</option>
        </select>
      </Field>

      <Field label="Your Vision">
        <textarea
          rows={5}
          placeholder="Tell me about your shoot — date, location, vibe..."
          value={form.message}
          onChange={e => update('message', e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </Field>

      {state === 'error' && (
        <p className="font-cond text-xs tracking-wider text-red-400">
          Something went wrong — try again or WhatsApp K.P directly.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={state === 'loading'}
        className="flex items-center gap-3 bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'Sending...' : 'Send Enquiry'}
        {state !== 'loading' && (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </div>
  )
}

const inputClass = `
  w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted
  font-body font-light text-sm px-4 py-3.5
  focus:outline-none focus:border-gold transition-colors duration-200
`

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="block font-cond text-[0.65rem] font-medium tracking-[0.2em] uppercase text-muted">
        {label}
      </label>
      {children}
    </div>
  )
}