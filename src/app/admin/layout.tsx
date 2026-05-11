import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin — K.P_PHOTOGRAPH',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink text-paper font-body">
      {children}
    </div>
  )
}