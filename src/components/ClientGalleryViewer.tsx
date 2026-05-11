'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Photo = { id: string; storage_path: string; title: string | null }

export default function ClientGalleryViewer({
  galleryId, clientName, description, shootDate, passwordHash, slug
}: {
  galleryId: string
  clientName: string
  description: string | null
  shootDate: string | null
  passwordHash: string
  slug: string
}) {
  const supabase = createBrowserClient()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Check session storage for already-unlocked gallery
  useEffect(() => {
    const saved = sessionStorage.getItem(`gallery-${slug}`)
    if (saved === 'unlocked') {
      setUnlocked(true)
      fetchPhotos()
    }
  }, [])

  async function fetchPhotos() {
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .eq('gallery_id', galleryId)
      .order('sort_order', { ascending: true })
    setPhotos(data ?? [])
  }

  function handleUnlock() {
    if (password === passwordHash) {
      setUnlocked(true)
      sessionStorage.setItem(`gallery-${slug}`, 'unlocked')
      fetchPhotos()
    } else {
      setError('Incorrect password — check your email from K.P.')
    }
  }

  function getUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/photos/${path}`
  }

  function prev() {
    const i = (lightboxIndex - 1 + photos.length) % photos.length
    setLightbox(photos[i]); setLightboxIndex(i)
  }

  function next() {
    const i = (lightboxIndex + 1) % photos.length
    setLightbox(photos[i]); setLightboxIndex(i)
  }

  // Password gate
  if (!unlocked) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-3">Private Gallery</p>
          <h1 className="font-serif text-3xl font-bold text-paper mb-2">{clientName}</h1>
          {shootDate && (
            <p className="font-body font-light text-muted text-sm mb-8">
              {new Date(shootDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          {description && (
            <p className="font-body font-light text-muted text-sm mb-8 leading-relaxed">{description}</p>
          )}

          <div className="space-y-3">
            <input
              type="password"
              placeholder="Enter your gallery password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleUnlock()}
              className="w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3.5 focus:outline-none focus:border-gold transition-colors text-center tracking-widest"
            />
            {error && <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>}
            <button
              onClick={handleUnlock}
              className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-4 hover:bg-gold-light transition-colors"
            >
              View My Photos
            </button>
          </div>

          <p className="font-body text-xs text-muted/40 mt-8">
            Password sent to your email by K.P_PHOTOGRAPH
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink pt-16">
      {/* Header */}
      <div className="px-6 md:px-14 py-10 border-b border-paper/[0.06]">
        <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-2">Your Gallery</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-paper mb-1">{clientName}</h1>
        {shootDate && (
          <p className="font-body font-light text-muted text-sm">
            {new Date(shootDate).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
        <p className="font-cond text-xs tracking-wider uppercase text-muted mt-3">
          {photos.length} photos
        </p>
      </div>

      {/* Gallery grid */}
      <div className="px-6 md:px-14 py-10">
        {photos.length === 0 ? (
          <p className="text-muted font-body font-light text-sm">Photos coming soon — K.P is still editing.</p>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-1 space-y-1">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                onClick={() => { setLightbox(photo); setLightboxIndex(index) }}
                className="group relative break-inside-avoid bg-mid cursor-pointer overflow-hidden"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={getUrl(photo.storage_path)}
                    alt={photo.title ?? 'Gallery photo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                {/* Download button on hover */}
                <div className="absolute inset-0 bg-ink/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <a
                    href={getUrl(photo.storage_path)}
                    download
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-2 border border-paper/40 text-paper font-cond text-[0.65rem] tracking-wider uppercase px-4 py-2 hover:bg-paper hover:text-ink transition-all duration-200"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/97 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-paper/60 hover:text-paper font-cond text-xs tracking-widest uppercase flex items-center gap-2">
            <span className="text-lg">×</span> Close
          </button>
          <div className="absolute top-5 left-5 font-cond text-xs tracking-widest text-muted">
            {lightboxIndex + 1} / {photos.length}
          </div>
          {photos.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-paper/20 flex items-center justify-center text-paper/60 hover:border-gold hover:text-gold transition-all z-10">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 border border-paper/20 flex items-center justify-center text-paper/60 hover:border-gold hover:text-gold transition-all z-10">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </>
          )}
          <div className="relative max-w-4xl w-full h-[80vh]" onClick={e => e.stopPropagation()}>
            <Image src={getUrl(lightbox.storage_path)} alt={lightbox.title ?? ''} fill className="object-contain" sizes="100vw" />
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4">
              {lightbox.title && <p className="font-serif text-paper text-sm">{lightbox.title}</p>}
              <a
                href={getUrl(lightbox.storage_path)}
                download
                className="flex items-center gap-2 bg-gold text-ink font-cond text-[0.65rem] tracking-wider uppercase px-4 py-2 hover:bg-gold-light transition-colors ml-auto"
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}