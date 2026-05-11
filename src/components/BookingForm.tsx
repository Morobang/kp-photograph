'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase-admin-client'

const SERVICES = [
  'Portrait Session',
  'Event Coverage',
  'Editorial & Commercial',
  'Other / Custom',
]

const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function BookingForm() {
  const supabase = createBrowserClient()
  const [state, setState] = useState<FormState>('idle')
  const [blockedDates, setBlockedDates] = useState<string[]>([])
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    service: '', shoot_date: '', shoot_time: '', location: '', message: '',
  })

  useEffect(() => {
    supabase
      .from('blocked_dates')
      .select('blocked_date')
      .then(({ data }) => {
        setBlockedDates((data ?? []).map((d: { blocked_date: string }) => d.blocked_date))
      })
  }, [])

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  // Get min date (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  function isBlocked(date: string) {
    return blockedDates.includes(date)
  }

  async function handleSubmit() {
    if (!form.first_name || !form.email || !form.service || !form.shoot_date || !form.shoot_time) return
    if (isBlocked(form.shoot_date)) return

    setState('loading')
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setState('success')
      setForm({
        first_name: '', last_name: '', email: '', phone: '',
        service: '', shoot_date: '', shoot_time: '', location: '', message: '',
      })
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="py-8">
        <div className="flex items-center gap-3 mb-4">
          <span className="block w-8 h-px bg-gold" />
          <span className="font-cond text-xs tracking-[0.2em] uppercase text-gold">Confirmed</span>
        </div>
        <h3 className="font-serif text-2xl md:text-3xl text-paper font-bold mb-3">
          Booking request sent!
        </h3>
        <p className="text-muted font-light text-sm leading-relaxed max-w-sm mb-6">
          K.P will confirm your shoot within 24 hours. Check your email for a confirmation.
        </p>
        <button
          onClick={() => setState('idle')}
          className="font-cond text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-5 py-2.5 hover:bg-gold hover:text-ink transition-all duration-300"
        >
          Book Another
        </button>
      </div>
    )
  }

  const inputClass = "w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3.5 focus:outline-none focus:border-gold transition-colors duration-200"

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name">
          <input type="text" placeholder="Thabo" value={form.first_name}
            onChange={e => update('first_name', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Last Name">
          <input type="text" placeholder="Mokoena" value={form.last_name}
            onChange={e => update('last_name', e.target.value)} className={inputClass} />
        </Field>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Email">
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => update('email', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Phone / WhatsApp">
          <input type="tel" placeholder="+27 XX XXX XXXX" value={form.phone}
            onChange={e => update('phone', e.target.value)} className={inputClass} />
        </Field>
      </div>

      {/* Service */}
      <Field label="Service">
        <select value={form.service} onChange={e => update('service', e.target.value)}
          className={`${inputClass} appearance-none`}>
          <option value="">— Select a package —</option>
          {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      {/* Date and time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Shoot Date">
          <input
            type="date"
            min={minDate}
            value={form.shoot_date}
            onChange={e => update('shoot_date', e.target.value)}
            className={`${inputClass} ${isBlocked(form.shoot_date) ? 'border-red-400' : ''}`}
          />
          {isBlocked(form.shoot_date) && (
            <p className="font-cond text-[0.65rem] tracking-wider text-red-400 mt-1">
              This date is unavailable — please choose another.
            </p>
          )}
        </Field>
        <Field label="Preferred Time">
          <select value={form.shoot_time} onChange={e => update('shoot_time', e.target.value)}
            className={`${inputClass} appearance-none`}>
            <option value="">— Select a time —</option>
            {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
      </div>

      {/* Location */}
      <Field label="Location / Area">
        <input type="text" placeholder="e.g. Pretoria CBD, Limpopo, Studio..."
          value={form.location} onChange={e => update('location', e.target.value)}
          className={inputClass} />
      </Field>

      {/* Message */}
      <Field label="Tell K.P More">
        <textarea rows={4} placeholder="What's the vibe? Any specific ideas?"
          value={form.message} onChange={e => update('message', e.target.value)}
          className={`${inputClass} resize-none`} />
      </Field>

      {state === 'error' && (
        <p className="font-cond text-xs tracking-wider text-red-400">
          Something went wrong — try again or WhatsApp K.P directly.
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={state === 'loading' || isBlocked(form.shoot_date)}
        className="flex items-center gap-3 bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-8 py-4 hover:bg-gold-light transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? 'Sending...' : 'Request Booking'}
        {state !== 'loading' && (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        )}
      </button>
    </div>
  )
}

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