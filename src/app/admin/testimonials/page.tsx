'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Testimonial = {
  id: string
  client_name: string
  service: string
  quote: string
  is_approved: boolean
  created_at: string
}

export default function AdminTestimonialsPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [form, setForm] = useState({ client_name: '', service: '', quote: '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  async function fetchTestimonials() {
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })
    setTestimonials(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchTestimonials()
  }, [authenticated])

  async function handleAdd() {
    if (!form.client_name || !form.quote) return
    setSaving(true)
    await supabase.from('testimonials').insert({
      ...form,
      is_approved: true,
    })
    setForm({ client_name: '', service: '', quote: '' })
    setSuccess('Testimonial added!')
    fetchTestimonials()
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function toggleApproved(t: Testimonial) {
    await supabase.from('testimonials').update({ is_approved: !t.is_approved }).eq('id', t.id)
    fetchTestimonials()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">
      Loading...
    </div>
  )
  if (!authenticated) return null

  const inputClass = "w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-10">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Testimonials</h1>
        </div>

        {/* Add new */}
        <div className="bg-off border border-paper/[0.06] p-6 md:p-8 mb-10 max-w-2xl">
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-6">Add Testimonial</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Client Name</label>
                <input
                  type="text"
                  placeholder="Thabo M."
                  value={form.client_name}
                  onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Service</label>
                <select
                  value={form.service}
                  onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">— Select —</option>
                  <option value="Portrait Session">Portrait Session</option>
                  <option value="Event Coverage">Event Coverage</option>
                  <option value="Editorial & Commercial">Editorial & Commercial</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Quote</label>
              <textarea
                rows={4}
                placeholder="What the client said..."
                value={form.quote}
                onChange={e => setForm(p => ({ ...p, quote: e.target.value }))}
                className={`${inputClass} resize-none`}
              />
            </div>
            {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}
            <button
              onClick={handleAdd}
              disabled={saving}
              className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-gold-light transition-colors duration-300 disabled:opacity-40"
            >
              {saving ? 'Saving...' : 'Add Testimonial'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 max-w-3xl">
          {testimonials.map(t => (
            <div key={t.id} className="bg-off border border-paper/[0.06] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="font-serif text-base font-bold text-paper">{t.client_name}</p>
                    {t.service && (
                      <span className="font-cond text-[0.6rem] tracking-wider uppercase text-gold">{t.service}</span>
                    )}
                    <span className={`font-cond text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border ${t.is_approved ? 'border-green-400/30 text-green-400' : 'border-paper/10 text-muted'}`}>
                      {t.is_approved ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="font-body font-light text-muted text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleApproved(t)}
                    className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-gold/30 hover:text-gold transition-colors"
                  >
                    {t.is_approved ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}