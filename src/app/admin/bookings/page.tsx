'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Booking = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  service: string
  shoot_date: string
  shoot_time: string
  location: string
  message: string
  status: string
  created_at: string
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'text-gold border-gold/30 bg-gold/5',
  confirmed: 'text-green-400 border-green-400/30 bg-green-400/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
  completed: 'text-muted border-paper/10 bg-paper/5',
}

export default function AdminBookingsPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [blockedDates, setBlockedDates] = useState<{ id: string; blocked_date: string; reason: string }[]>([])
  const [filter, setFilter] = useState('all')
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')
  const [tab, setTab] = useState<'bookings' | 'availability'>('bookings')

  async function fetchBookings() {
    let query = supabase.from('bookings').select('*').order('shoot_date', { ascending: true })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    setBookings(data ?? [])
  }

  async function fetchBlocked() {
    const { data } = await supabase.from('blocked_dates').select('*').order('blocked_date', { ascending: true })
    setBlockedDates(data ?? [])
  }

  useEffect(() => {
    if (authenticated) { fetchBookings(); fetchBlocked() }
  }, [authenticated, filter])

  async function updateStatus(id: string, status: string) {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  async function blockDate() {
    if (!newBlockDate) return
    await supabase.from('blocked_dates').insert({ blocked_date: newBlockDate, reason: newBlockReason })
    setNewBlockDate('')
    setNewBlockReason('')
    fetchBlocked()
  }

  async function unblockDate(id: string) {
    await supabase.from('blocked_dates').delete().eq('id', id)
    fetchBlocked()
  }

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">
      Loading...
    </div>
  )
  if (!authenticated) return null

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-8">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Bookings</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['bookings', 'availability'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-cond text-xs tracking-[0.15em] uppercase px-5 py-2.5 border transition-all duration-200 ${
                tab === t ? 'border-gold text-gold-light' : 'border-paper/10 text-muted hover:border-paper/30'
              }`}
            >
              {t === 'bookings' ? 'Bookings' : 'Block Dates'}
            </button>
          ))}
        </div>

        {tab === 'bookings' && (
          <>
            {/* Status filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-cond text-[0.7rem] tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                    filter === f ? 'border-gold text-gold-light' : 'border-paper/10 text-muted hover:border-paper/30'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {bookings.length === 0 ? (
              <p className="font-body font-light text-muted text-sm">No bookings found.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map(booking => (
                  <div key={booking.id} className="bg-off border border-paper/[0.06] p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <p className="font-serif text-base font-bold text-paper">
                            {booking.first_name} {booking.last_name}
                          </p>
                          <span className={`font-cond text-[0.6rem] tracking-wider uppercase px-2.5 py-1 border ${STATUS_COLORS[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-5 gap-y-1 mb-3">
                          <p className="font-cond text-[0.65rem] tracking-wider uppercase text-gold">
                            {booking.service}
                          </p>
                          <p className="font-body font-light text-muted text-xs">
                            📅 {new Date(booking.shoot_date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })} at {booking.shoot_time}
                          </p>
                          {booking.location && (
                            <p className="font-body font-light text-muted text-xs">📍 {booking.location}</p>
                          )}
                          <p className="font-body font-light text-muted text-xs">{booking.email}</p>
                          {booking.phone && <p className="font-body font-light text-muted text-xs">{booking.phone}</p>}
                        </div>

                        {booking.message && (
                          <p className="font-body font-light text-paper/50 text-sm leading-relaxed">
                            {booking.message}
                          </p>
                        )}
                      </div>

                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'confirmed')}
                            className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-green-400/30 text-green-400 hover:bg-green-400/10 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'completed')}
                            className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-paper/30 hover:text-paper transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => updateStatus(booking.id, 'cancelled')}
                            className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                        
                          href={`mailto:${booking.email}`}
                          className="font-cond text-[0.65rem] tracking-wider uppercase px-3 py-2 border border-paper/10 text-muted hover:border-gold/30 hover:text-gold transition-colors text-center"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'availability' && (
          <div className="max-w-lg">
            <p className="font-body font-light text-muted text-sm mb-6 leading-relaxed">
              Block dates so clients can't book on days K.P is unavailable or already booked.
            </p>

            {/* Block new date */}
            <div className="bg-off border border-paper/[0.06] p-6 mb-6">
              <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-4">Block a Date</p>
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Date</label>
                  <input
                    type="date"
                    value={newBlockDate}
                    onChange={e => setNewBlockDate(e.target.value)}
                    className="w-full bg-paper/[0.03] border border-paper/10 text-paper font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Reason (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Already booked, Holiday..."
                    value={newBlockReason}
                    onChange={e => setNewBlockReason(e.target.value)}
                    className="w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <button
                  onClick={blockDate}
                  disabled={!newBlockDate}
                  className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3 hover:bg-gold-light transition-colors disabled:opacity-40"
                >
                  Block Date
                </button>
              </div>
            </div>

            {/* Blocked dates list */}
            <div className="space-y-2">
              <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-3">
                Blocked Dates ({blockedDates.length})
              </p>
              {blockedDates.length === 0 ? (
                <p className="font-body font-light text-muted text-sm">No blocked dates.</p>
              ) : (
                blockedDates.map(d => (
                  <div key={d.id} className="bg-off border border-paper/[0.06] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-body text-sm text-paper">
                        {new Date(d.blocked_date).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      {d.reason && <p className="font-body text-xs text-muted">{d.reason}</p>}
                    </div>
                    <button
                      onClick={() => unblockDate(d.id)}
                      className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                    >
                      Unblock
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}