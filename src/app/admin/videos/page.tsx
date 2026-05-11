'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Video = {
  id: string
  title: string
  storage_path: string
  thumbnail_path: string | null
  is_featured: boolean
  created_at: string
}

export default function AdminVideosPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const fileRef = useRef<HTMLInputElement>(null)
  const thumbRef = useRef<HTMLInputElement>(null)

  const [videos, setVideos] = useState<Video[]>([])
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [thumb, setThumb] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  async function fetchVideos() {
    const { data } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })
    setVideos(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchVideos()
  }, [authenticated])

  async function handleUpload() {
    if (!file || !title) {
      setError('Please select a video file and add a title.')
      return
    }
    setUploading(true)
    setError('')
    setSuccess('')

    const ext = file.name.split('.').pop()
    const filename = `reel-${Date.now()}.${ext}`

    setProgress('Uploading video...')
    const { error: vidErr } = await supabase.storage
      .from('videos')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (vidErr) {
      setError('Video upload failed: ' + vidErr.message)
      setUploading(false)
      setProgress('')
      return
    }

    let thumbPath = null
    if (thumb) {
      setProgress('Uploading thumbnail...')
      const thumbExt = thumb.name.split('.').pop()
      const thumbName = `thumb-${Date.now()}.${thumbExt}`
      const { error: thumbErr } = await supabase.storage
        .from('videos')
        .upload(thumbName, thumb, { cacheControl: '3600', upsert: false })
      if (!thumbErr) thumbPath = thumbName
    }

    setProgress('Saving...')
    const { error: dbErr } = await supabase
      .from('videos')
      .insert({ title, storage_path: filename, thumbnail_path: thumbPath, is_featured: false })

    if (dbErr) {
      setError('Saved to storage but database insert failed.')
    } else {
      setSuccess('Video uploaded successfully!')
      setTitle('')
      setFile(null)
      setThumb(null)
      if (fileRef.current) fileRef.current.value = ''
      if (thumbRef.current) thumbRef.current.value = ''
      fetchVideos()
    }

    setUploading(false)
    setProgress('')
  }

  async function toggleFeatured(video: Video) {
    // Unfeatured all first, then feature this one
    await supabase.from('videos').update({ is_featured: false }).neq('id', video.id)
    await supabase.from('videos').update({ is_featured: !video.is_featured }).eq('id', video.id)
    fetchVideos()
  }

  async function handleDelete(video: Video) {
    if (!confirm(`Delete "${video.title}"?`)) return
    await supabase.storage.from('videos').remove([video.storage_path])
    if (video.thumbnail_path) {
      await supabase.storage.from('videos').remove([video.thumbnail_path])
    }
    await supabase.from('videos').delete().eq('id', video.id)
    fetchVideos()
  }

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">
      Loading...
    </div>
  )
  if (!authenticated) return null

  const inputClass = "w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 md:p-10">
        <div className="mb-10">
          <p className="font-cond text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-1">Manage</p>
          <h1 className="font-serif text-3xl font-bold text-paper">Videos</h1>
          <p className="font-body font-light text-muted text-sm mt-2">
            Upload showreels and video content. Mark one as featured to show it on the homepage.
          </p>
        </div>

        {/* Upload */}
        <div className="bg-off border border-paper/[0.06] p-6 md:p-8 mb-10 max-w-2xl">
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-6">Upload Video</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Title</label>
              <input
                type="text"
                placeholder="e.g. 2024 Showreel"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
                Video File (MP4, MOV, WEBM)
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors cursor-pointer p-6 text-center"
              >
                <p className="font-cond text-xs tracking-wider uppercase text-muted">
                  {file ? file.name : 'Click to select video'}
                </p>
                {file && (
                  <p className="font-body text-xs text-muted/50 mt-1">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/mov,video/webm,video/quicktime"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
                Thumbnail Image (optional)
              </label>
              <div
                onClick={() => thumbRef.current?.click()}
                className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors cursor-pointer p-4 text-center"
              >
                <p className="font-cond text-xs tracking-wider uppercase text-muted">
                  {thumb ? thumb.name : 'Click to select thumbnail'}
                </p>
              </div>
              <input
                ref={thumbRef}
                type="file"
                accept="image/*"
                onChange={e => setThumb(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </div>

            {error && <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>}
            {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}
            {progress && <p className="font-cond text-xs tracking-wider text-gold/60">{progress}</p>}

            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3.5 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? progress || 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </div>

        {/* Videos list */}
        <div className="space-y-3 max-w-2xl">
          <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
            All Videos ({videos.length})
          </p>
          {videos.map(video => (
            <div key={video.id} className="bg-off border border-paper/[0.06] p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {/* Mini thumbnail */}
                <div className="w-16 h-10 bg-mid flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {video.thumbnail_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${supabaseUrl}/storage/v1/object/public/videos/${video.thumbnail_path}`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24" className="text-muted">
                      <path d="M15 10l4.553-2.069A1 1 0 0 1 21 8.82v6.36a1 1 0 0 1-1.447.89L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-body text-sm text-paper">{video.title}</p>
                  {video.is_featured && (
                    <p className="font-cond text-[0.6rem] tracking-wider uppercase text-gold mt-0.5">
                      Featured on homepage
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured(video)}
                  className={`font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                    video.is_featured
                      ? 'border-gold/30 text-gold'
                      : 'border-paper/10 text-muted hover:border-gold/30 hover:text-gold'
                  }`}
                >
                  {video.is_featured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => handleDelete(video)}
                  className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}