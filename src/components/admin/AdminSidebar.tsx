'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase-admin-client'

// Group 1: Core Content Management
const contentItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: '/admin/photos',
    label: 'Photos',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    href: '/admin/videos',
    label: 'Videos',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 0-2-2V8z" />
      </svg>
    ),
  },
  {
    href: '/admin/before-after',
    label: 'Before & After',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M12 3v18" />
      </svg>
    ),
  },
  {
    href: '/admin/galleries',
    label: 'Client Galleries',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
]

// Group 2: Business & Services
const businessItems = [
  {
    href: '/admin/services',
    label: 'Services',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    href: '/admin/bookings',
    label: 'Bookings',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    href: '/admin/enquiries',
    label: 'Enquiries',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/testimonials',
    label: 'Testimonials',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

// Group 3: Settings & Organization
const settingsItems = [
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h16M4 14h8M4 18h8" />
      </svg>
    ),
  },
  {
    href: '/admin/blog',
    label: 'Blog',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    href: '/admin/profile',
    label: 'Profile',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin')
  }

  // Helper to render nav items
  function NavGroup({ title, items }: { title?: string; items: typeof contentItems }) {
    return (
      <div className="mb-6">
        {title && (
          <p className="px-3 mb-2 text-[0.6rem] font-cond tracking-[0.2em] uppercase text-muted/60">
            {title}
          </p>
        )}
        {items.map(item => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 font-cond text-xs tracking-[0.1em] uppercase transition-all duration-200 ${
                active
                  ? 'bg-gold/10 text-gold-light border-l-2 border-gold'
                  : 'text-muted hover:text-paper hover:bg-paper/5'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <aside className="w-56 min-h-screen bg-off border-r border-paper/[0.06] flex flex-col">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-paper/[0.06]">
        <p className="font-cond tracking-wider text-sm">
          <span className="font-semibold text-gold-light">K.P_PHO</span>
          <span className="font-light text-paper/60">TOGRAPH</span>
        </p>
        <p className="font-cond text-[0.6rem] tracking-[0.2em] uppercase text-muted mt-0.5">
          Admin Panel
        </p>
      </div>

      {/* Navigation with Groups */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <NavGroup items={contentItems} />
        <NavGroup title="Business" items={businessItems} />
        <NavGroup title="Settings" items={settingsItems} />
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-paper/[0.06]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full font-cond text-xs tracking-[0.1em] uppercase text-muted hover:text-red-400 transition-colors duration-200"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}