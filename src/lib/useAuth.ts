'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from './supabase-admin-client'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setAuthenticated(true)
      } else {
        router.push('/admin')
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.push('/admin')
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { loading, authenticated, supabase }
}
