'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Stats = {
  totalPhotos: number
  newEnquiries: number
  totalEnquiries: number
}

export default function DashboardPage() {
  const { loading, authenticated } = useAuth()
  const [stats, setStats] = useState<Stats>({ totalPhotos: 0, newEnquiries: 0, totalEnquiries: 0 })
  const supabase = createBrowserClient()

  useEffect(() => {
    if (!authenticated) return
    async function fetchStats() {
      const [{ count: totalPhotos }, { count: totalEnquiries }, { count: newEnquiries }] =
        await Promise.all([
          supabase.from('photos').select('*', { count: 'exact', head: true }),
          supabase.from('enquiries').select('*', { count: 'exact', head: true }),
          supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'new'),
        ])
      setStats({
        totalPhotos: totalPhotos ?? 0,
        totalEnquiries: totalEnquiries ?? 0,
        newEnquiries: newEnquiries ?? 0,
      })
    }
    fetchStats()
  }, [authenticated])

  if (loading) return <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">Loading...</div>
  if (!authenticated) return null

  const statCards = [
    { label: 'Total Photos', value: stats.totalPhotos, color: 'text-gold-light' },
    { label: 'New Enquiries', value: stats.newEnquiries, color: 'text-green-400' },
    { label: 'Total Enquiries', value: stats.totalEnquiries, color: 'text-paper' },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-10">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Admin</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Dashboard</h1>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {statCards.map(card => (
            <div key={card.label} className="bg-off border border-paper/[0.06] p-6">
              <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-3">
                {card.label}
              </p>
              <p className={`font-serif text-4xl font-bold ${card.color}`}>
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
            href="/admin/photos"
            className="group bg-off border border-paper/[0.06] p-6 hover:border-gold/30 transition-colors duration-300"
          >
            <p className="font-cond text-xs tracking-[0.15em] uppercase text-gold mb-2">Manage</p>
            <p className="font-serif text-xl font-bold text-paper mb-1">Photos</p>
            <p className="font-body font-light text-muted text-sm">Upload new work, manage categories</p>
          </a>
          
            href="/admin/enquiries"
            className="group bg-off border border-paper/[0.06] p-6 hover:border-gold/30 transition-colors duration-300"
          >
            <p className="font-cond text-xs tracking-[0.15em] uppercase text-gold mb-2">Review</p>
            <p className="font-serif text-xl font-bold text-paper mb-1">Enquiries</p>
            <p className="font-body font-light text-muted text-sm">View and respond to booking requests</p>
          </a>
        </div>
      </main>
    </div>
  )
}