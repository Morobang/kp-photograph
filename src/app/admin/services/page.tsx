'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import { Service } from '@/lib/types'

export default function AdminServicesPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const [services, setServices] = useState<Service[]>([])
  const [editing, setEditing] = useState<Service | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })
    setServices(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchServices()
  }, [authenticated])

  async function handleSave() {
    if (!editing) return
    setSaving(true)
    await supabase
      .from('services')
      .update({
        name: editing.name,
        description: editing.description,
        price_from: editing.price_from,
        is_active: editing.is_active,
      })
      .eq('id', editing.id)
    setSuccess('Saved!')
    setEditing(null)
    fetchServices()
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
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
          <h1 className="font-serif text-3xl font-bold text-paper">Services & Pricing</h1>
          <p className="font-body font-light text-muted text-sm mt-2">
            Update your packages and pricing — changes reflect on the site immediately.
          </p>
        </div>

        {success && (
          <p className="font-cond text-xs tracking-wider text-green-400 mb-6">{success}</p>
        )}

        <div className="space-y-4 max-w-2xl">
          {services.map(service => (
            <div key={service.id} className="bg-off border border-paper/[0.06] p-6">
              {editing?.id === service.id ? (
                /* Edit mode */
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Service Name</label>
                    <input
                      type="text"
                      value={editing.name}
                      onChange={e => setEditing(p => p ? { ...p, name: e.target.value } : p)}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Description</label>
                    <textarea
                      rows={3}
                      value={editing.description}
                      onChange={e => setEditing(p => p ? { ...p, description: e.target.value } : p)}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Starting Price (ZAR)</label>
                    <input
                      type="number"
                      value={editing.price_from}
                      onChange={e => setEditing(p => p ? { ...p, price_from: Number(e.target.value) } : p)}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`active-${service.id}`}
                      checked={editing.is_active}
                      onChange={e => setEditing(p => p ? { ...p, is_active: e.target.checked } : p)}
                      className="accent-gold"
                    />
                    <label htmlFor={`active-${service.id}`} className="font-cond text-xs tracking-wider uppercase text-muted">
                      Active (visible on site)
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3 hover:bg-gold-light transition-colors disabled:opacity-40"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="font-cond text-xs tracking-[0.2em] uppercase px-6 py-3 border border-paper/10 text-muted hover:text-paper transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-cond text-base font-semibold tracking-wide uppercase text-paper">
                        {service.name}
                      </p>
                      {!service.is_active && (
                        <span className="font-cond text-[0.6rem] tracking-wider uppercase text-muted border border-paper/10 px-2 py-0.5">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="font-body font-light text-muted text-sm mb-3 leading-relaxed">
                      {service.description}
                    </p>
                    <p className="font-serif text-xl font-bold text-gold-light">
                      R{service.price_from.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setEditing(service)}
                    className="flex-shrink-0 font-cond text-[0.65rem] tracking-wider uppercase px-4 py-2 border border-paper/10 text-muted hover:border-gold/30 hover:text-gold transition-colors"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}