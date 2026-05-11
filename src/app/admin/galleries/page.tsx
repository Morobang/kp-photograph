'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Gallery = {
  id: string
  client_name: string
  slug: string
  description: string | null
  shoot_date: string | null
  password_hash: string
  is_active: boolean
  created_at: string
}

export default function AdminGalleriesPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [galleries, setGalleries] = useState<Gallery[]>([])
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null)
  const [view, setView] = useState<'list' | 'create' | 'manage'>('list')
  const [form, setForm] = useState({ client_name: '', password_hash: '', description: '', shoot_date: '' })
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [galleryPhotos, setGalleryPhotos] = useState<{ id: string; storage_path: string }[]>([])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  function toSlug(str: string) {
    return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function fetchGalleries() {
    const { data } = await supabase.from('client_galleries').select('*').order('created_at', { ascending: false })
    setGalleries(data ?? [])
  }

  async function fetchGalleryPhotos(galleryId: string) {
    const { data } = await supabase.from('gallery_photos').select('*').eq('gallery_id', galleryId).order('sort_order', { ascending: true })
    setGalleryPhotos(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchGalleries()
  }, [authenticated])

  async function createGallery() {
    if (!form.client_name || !form.password_hash) {
      setError('Client name and password are required.')
      return
    }
    const slug = toSlug(form.client_name) + '-' + Date.now().toString().slice(-4)
    const { error: err } = await supabase.from('client_galleries').insert({
      client_name: form.client_name,
      slug,
      password_hash: form.password_hash,
      description: form.description || null,
      shoot_date: form.shoot_date || null,
    })
    if (err) { setError(err.message); return }
    setSuccess('Gallery created!')
    setForm({ client_name: '', password_hash: '', description: '', shoot_date: '' })
    setView('list')
    fetchGalleries()
    setTimeout(() => setSuccess(''), 3000)
  }

  async function uploadPhotos() {
    if (!uploadFiles || !selectedGallery) return
    setUploading(true)
    const files = Array.from(uploadFiles)

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`Uploading ${i + 1} of ${files.length}...`)
      const ext = file.name.split('.').pop()
      const path = `client-galleries/${selectedGallery.id}/${Date.now()}-${i}.${ext}`

      const { error: upErr } = await supabase.storage.from('photos').upload(path, file, { cacheControl: '3600' })
      if (upErr) continue

      await supabase.from('gallery_photos').insert({ gallery_id: selectedGallery.id, storage_path: path, sort_order: i })
    }

    setUploading(false)
    setUploadProgress('')
    setSuccess(`${files.length} photos uploaded!`)
    fetchGalleryPhotos(selectedGallery.id)
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setSuccess(''), 3000)
  }

  async function deletePhoto(photoId: string, storagePath: string) {
    await supabase.storage.from('photos').remove([storagePath])
    await supabase.from('gallery_photos').delete().eq('id', photoId)
    if (selectedGallery) fetchGalleryPhotos(selectedGallery.id)
  }

  async function toggleActive(gallery: Gallery) {
    await supabase.from('client_galleries').update({ is_active: !gallery.is_active }).eq('id', gallery.id)
    fetchGalleries()
  }

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">Loading...</div>
  )
  if (!authenticated) return null

  const inputClass = "w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"

  // Create view
  if (view === 'create') {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 md:p-10 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView('list')} className="font-cond text-xs tracking-wider uppercase text-muted hover:text-paper transition-colors">← Back</button>
            <h1 className="font-serif text-2xl font-bold text-paper">New Client Gallery</h1>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Client Name</label>
              <input type="text" placeholder="e.g. Thabo & Lerato" value={form.client_name}
                onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Gallery Password</label>
              <input type="text" placeholder="e.g. ThaboLerato2025" value={form.password_hash}
                onChange={e => setForm(p => ({ ...p, password_hash: e.target.value }))} className={inputClass} />
              <p className="font-body text-xs text-muted/50">Share this password with the client via WhatsApp or email.</p>
            </div>
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Shoot Date</label>
              <input type="date" value={form.shoot_date}
                onChange={e => setForm(p => ({ ...p, shoot_date: e.target.value }))} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Description (optional)</label>
              <textarea rows={3} placeholder="e.g. Outdoor portrait session, Pretoria..."
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className={`${inputClass} resize-none`} />
            </div>
            {error && <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>}
            {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}
            <div className="flex gap-3">
              <button onClick={createGallery}
                className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-gold-light transition-colors">
                Create Gallery
              </button>
              <button onClick={() => setView('list')}
                className="font-cond text-xs tracking-[0.2em] uppercase px-6 py-3.5 border border-paper/10 text-muted hover:text-paper transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Manage photos view
  if (view === 'manage' && selectedGallery) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 md:p-10">
          <div className="flex items-center gap-4 mb-2">
            <button onClick={() => { setView('list'); setSelectedGallery(null) }}
              className="font-cond text-xs tracking-wider uppercase text-muted hover:text-paper transition-colors">
              ← Back
            </button>
            <h1 className="font-serif text-2xl font-bold text-paper">{selectedGallery.client_name}</h1>
          </div>
          <p className="font-mono text-xs text-muted/40 mb-8">
            Link: /gallery/{selectedGallery.slug} · Password: {selectedGallery.password_hash}
          </p>

          {/* Upload */}
          <div className="bg-off border border-paper/[0.06] p-6 mb-8 max-w-lg">
            <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-4">Upload Photos</p>
            <div className="space-y-3">
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors cursor-pointer p-6 text-center"
              >
                <p className="font-cond text-xs tracking-wider uppercase text-muted">
                  {uploadFiles ? `${uploadFiles.length} files selected` : 'Click to select photos (multiple allowed)'}
                </p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple
                onChange={e => setUploadFiles(e.target.files)} className="hidden" />
              {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}
              {uploadProgress && <p className="font-cond text-xs tracking-wider text-gold/60">{uploadProgress}</p>}
              <button onClick={uploadPhotos} disabled={uploading || !uploadFiles}
                className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3 hover:bg-gold-light transition-colors disabled:opacity-40">
                {uploading ? uploadProgress : 'Upload Photos'}
              </button>
            </div>
          </div>

          {/* Photos grid */}
          <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
            Photos in Gallery ({galleryPhotos.length})
          </p>
          {galleryPhotos.length === 0 ? (
            <p className="font-body font-light text-muted text-sm">No photos yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {galleryPhotos.map(photo => (
                <div key={photo.id} className="group relative aspect-square bg-mid overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${supabaseUrl}/storage/v1/object/public/photos/${photo.storage_path}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-ink/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => deletePhoto(photo.id, photo.storage_path)}
                      className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-red-400/50 text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
            <h1 className="font-serif text-3xl font-bold text-paper">Client Galleries</h1>
            <p className="font-body font-light text-muted text-sm mt-1">Private galleries for each client to download their photos.</p>
          </div>
          <button onClick={() => setView('create')}
            className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3 hover:bg-gold-light transition-colors">
            + New Gallery
          </button>
        </div>

        {success && <p className="font-cond text-xs tracking-wider text-green-400 mb-6">{success}</p>}

        {galleries.length === 0 ? (
          <p className="font-body font-light text-muted text-sm">No galleries yet.</p>
        ) : (
          <div className="space-y-3">
            {galleries.map(gallery => (
              <div key={gallery.id} className="bg-off border border-paper/[0.06] p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-serif text-base font-bold text-paper">{gallery.client_name}</p>
                    <span className={`font-cond text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border ${
                      gallery.is_active ? 'border-green-400/30 text-green-400' : 'border-paper/10 text-muted'
                    }`}>
                      {gallery.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {gallery.shoot_date && (
                    <p className="font-body text-xs text-muted mb-1">
                      {new Date(gallery.shoot_date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <p className="font-mono text-[0.6rem] text-muted/40">/gallery/{gallery.slug}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                  <button
                    onClick={() => { setSelectedGallery(gallery); fetchGalleryPhotos(gallery.id); setView('manage') }}
                    className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-gold/30 text-gold hover:bg-gold/10 transition-colors"
                  >
                    Manage
                  </button>
                  
                    href={`/gallery/${gallery.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-paper/30 hover:text-paper transition-colors"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => toggleActive(gallery)}
                    className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-paper/30 hover:text-paper transition-colors"
                  >
                    {gallery.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}