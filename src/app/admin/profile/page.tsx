'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import Image from 'next/image'

export default function AdminProfilePage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  function getAvatarUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${path}`
  }

  async function fetchCurrent() {
    const { data } = await supabase.storage.from('avatars').list('')
    const portrait = data?.find(f => f.name.startsWith('portrait'))
    if (portrait) setCurrentUrl(getAvatarUrl(portrait.name))
  }

  useEffect(() => {
    if (authenticated) fetchCurrent()
  }, [authenticated])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload() {
    if (!file) { setError('Please select a photo.'); return }
    setUploading(true)
    setError('')
    setSuccess('')

    const ext = file.name.split('.').pop()
    const filename = `portrait.${ext}`

    // Remove old portrait first
    const { data: existing } = await supabase.storage.from('avatars').list('')
    const old = existing?.find(f => f.name.startsWith('portrait'))
    if (old) await supabase.storage.from('avatars').remove([old.name])

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filename, file, { cacheControl: '3600', upsert: true })

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    setSuccess('Profile photo updated!')
    setCurrentUrl(getAvatarUrl(filename) + '?t=' + Date.now())
    setPreview(null)
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
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
        <div className="mb-10">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Profile Photo</h1>
          <p className="font-body font-light text-muted text-sm mt-2">
            This photo appears on the About page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl">
          {/* Current photo */}
          <div>
            <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
              Current Photo
            </p>
            <div className="relative aspect-[3/4] bg-mid overflow-hidden">
              {currentUrl ? (
                <Image
                  src={currentUrl}
                  alt="Current profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="font-cond text-xs tracking-widest uppercase text-muted">
                    No photo yet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload new */}
          <div>
            <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
              Upload New Photo
            </p>

            {/* Preview */}
            <div
              onClick={() => fileRef.current?.click()}
              className="relative aspect-[3/4] bg-mid border border-dashed border-paper/20 hover:border-gold/50 transition-colors duration-300 cursor-pointer overflow-hidden mb-4"
            >
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-muted">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <p className="font-cond text-xs tracking-wider uppercase text-muted">
                    Click to select
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && <p className="font-cond text-xs tracking-wider text-red-400 mb-3">{error}</p>}
            {success && <p className="font-cond text-xs tracking-wider text-green-400 mb-3">{success}</p>}

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3.5 hover:bg-gold-light transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Update Profile Photo'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}