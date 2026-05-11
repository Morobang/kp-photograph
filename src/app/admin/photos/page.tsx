'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import { Photo } from '@/lib/types'
import Image from 'next/image'

const CATEGORIES = ['portrait', 'event', 'landscape', 'editorial', 'general']

export default function AdminPhotosPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)

  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('portrait')
  const [title, setTitle] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function getUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${path}`
  }

  async function fetchPhotos() {
    const { data } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false })
    setPhotos(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchPhotos()
  }, [authenticated])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    // Auto-fill title from filename
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '))
  }

  async function handleUpload() {
    if (!file || !title) { setError('Please select a file and add a title.'); return }
    setUploading(true)
    setError('')
    setSuccess('')

    const ext = file.name.split('.').pop()
    const filename = `${category}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase
      .from('photos')
      .insert({ title, storage_path: filename, category, is_featured: false, sort_order: 0 })

    if (dbError) {
      setError('Photo saved to storage but database insert failed.')
      setUploading(false)
      return
    }

    setSuccess('Photo uploaded successfully!')
    setFile(null)
    setPreview(null)
    setTitle('')
    if (fileRef.current) fileRef.current.value = ''
    fetchPhotos()
    setUploading(false)
  }

  async function handleDelete(photo: Photo) {
    if (!confirm(`Delete "${photo.title}"? This cannot be undone.`)) return

    await supabase.storage.from('photos').remove([photo.storage_path])
    await supabase.from('photos').delete().eq('id', photo.id)
    fetchPhotos()
  }

  async function toggleFeatured(photo: Photo) {
    await supabase
      .from('photos')
      .update({ is_featured: !photo.is_featured })
      .eq('id', photo.id)
    fetchPhotos()
  }

  if (loading) return <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">Loading...</div>
  if (!authenticated) return null

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-10">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Photos</h1>
        </div>

        {/* Upload box */}
        <div className="bg-off border border-paper/[0.06] p-6 md:p-8 mb-10">
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-6">Upload New Photo</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left — file drop */}
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center py-10 px-6 text-center mb-4"
              >
                {preview ? (
                  <div className="relative w-full h-48">
                    <Image src={preview} alt="Preview" fill className="object-contain" />
                  </div>
                ) : (
                  <>
                    <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-muted mb-3">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                    </svg>
                    <p className="font-cond text-xs tracking-wider uppercase text-muted">Click to select photo</p>
                    <p className="font-body text-xs text-muted/50 mt-1">JPG, PNG, WEBP</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Right — fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Golden Hour Portrait"
                  className="w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-paper/[0.03] border border-paper/10 text-paper font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors appearance-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-ink">
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>}
              {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}

              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3.5 hover:bg-gold-light transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Existing photos grid */}
        <div>
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-muted mb-5">
            All Photos ({photos.length})
          </p>

          {photos.length === 0 ? (
            <p className="text-muted font-body font-light text-sm">No photos yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {photos.map(photo => (
                <div key={photo.id} className="group relative bg-mid overflow-hidden">
                  <div className="relative aspect-square">
                    <Image
                      src={getUrl(photo.storage_path)}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                    <div className="flex justify-end gap-2">
                      {/* Feature toggle */}
                      <button
                        onClick={() => toggleFeatured(photo)}
                        title={photo.is_featured ? 'Unfeature' : 'Feature'}
                        className={`p-1.5 border transition-colors ${photo.is_featured ? 'border-gold text-gold' : 'border-paper/20 text-muted hover:border-gold hover:text-gold'}`}
                      >
                        <svg width="12" height="12" fill={photo.is_featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(photo)}
                        className="p-1.5 border border-paper/20 text-muted hover:border-red-400 hover:text-red-400 transition-colors"
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>

                    <div>
                      <p className="font-cond text-[0.6rem] tracking-wider uppercase text-gold mb-0.5">{photo.category}</p>
                      <p className="font-body text-xs text-paper truncate">{photo.title}</p>
                      {photo.is_featured && (
                        <p className="font-cond text-[0.55rem] tracking-wider uppercase text-gold/60 mt-0.5">Featured</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}