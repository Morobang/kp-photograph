'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import { Enquiry } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  new: 'text-green-400 border-green-400/30 bg-green-400/5',
  read: 'text-muted border-paper/10 bg-paper/5',
  booked: 'text-gold border-gold/30 bg-gold/5',
}

export default function AdminEnquiriesPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'booked'>('all')

  async function fetchEnquiries() {
    let query = supabase
      .from('enquiries')
      .select('*')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setEnquiries(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchEnquiries()
  }, [authenticated, filter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('enquiries').update({ status }).eq('id', id)
    fetchEnquiries()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this enquiry?')) return
    await supabase.from('enquiries').delete().eq('id', id)
    fetchEnquiries()
  }

  if (loading) return <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">Loading...</div>
  if (!authenticated) return null

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-8">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Review</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Enquiries</h1>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'new', 'read', 'booked'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-cond text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                filter === f
                  ? 'border-gold text-gold-light'
                  : 'border-paper/10 text-muted hover:border-paper/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Enquiries list */}
        {enquiries.length === 0 ? (
          <p className="text-muted font-body font-light text-sm">No enquiries found.</p>
        ) : (
          <div className="space-y-3">
            {enquiries.map(enquiry => (
              <div
                key={enquiry.id}
                className="bg-off border border-paper/[0.06] p-5 md:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <p className="font-serif text-base font-bold text-paper">
                        {enquiry.first_name} {enquiry.last_name}
                      </p>
                      <span className={`font-cond text-[0.6rem] tracking-[0.15em] uppercase px-2.5 py-1 border ${STATUS_COLORS[enquiry.status]}`}>
                        {enquiry.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 mb-3">
                      <p className="font-body font-light text-muted text-xs">{enquiry.email}</p>
                      <p className="font-cond text-[0.65rem] tracking-wider uppercase text-gold text-xs">{enquiry.service}</p>
                      <p className="font-body font-light text-muted text-xs">
                        {new Date(enquiry.created_at).toLocaleDateString('en-ZA', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>

                    <p className="font-body font-light text-paper/60 text-sm leading-relaxed">
                      {enquiry.message}
                    </p>
                  </div>

                  {/* Right actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0">
                    {enquiry.status === 'new' && (
                      <button
                        onClick={() => updateStatus(enquiry.id, 'read')}
                        className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-paper/30 hover:text-paper transition-colors"
                      >
                        Mark Read
                      </button>
                    )}
                    {enquiry.status !== 'booked' && (
                      <button
                        onClick={() => updateStatus(enquiry.id, 'booked')}
                        className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-gold/30 text-gold hover:bg-gold hover:text-ink transition-all duration-200"
                      >
                        Mark Booked
                      </button>
                    )}
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-paper/30 hover:text-paper transition-colors text-center"
                    >
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}