'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type BeforeAfterItem = {
  id: string
  title: string
  before_path: string
  after_path: string
  is_active: boolean
}

export default function AdminBeforeAfterPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  const [items, setItems] = useState<BeforeAfterItem[]>([])
  const [title, setTitle] = useState('')
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function fetchItems() {
    const { data } = await supabase
      .from('before_afters')
      .select('*')
      .order('sort_order', { ascending: true })
    setItems(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchItems()
  }, [authenticated])

  async function uploadFile(file: File, prefix: string) {
    const ext = file.name.split('.').pop()
    const path = `before-after/${prefix}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('photos')
      .upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) throw error
    return path
  }

  async function handleUpload() {
    if (!beforeFile || !afterFile || !title) {
      setError('Please fill in the title and select both images.')
      return
    }
    setUploading(true)
    setError('')
    setSuccess('')

    try {
      const [beforePath, afterPath] = await Promise.all([
        uploadFile(beforeFile, 'before'),
        uploadFile(afterFile, 'after'),
      ])

      const { error: dbErr } = await supabase
        .from('before_afters')
        .insert({ title, before_path: beforePath, after_path: afterPath, sort_order: items.length })

      if (dbErr) throw dbErr

      setSuccess('Added successfully!')
      setTitle('')
      setBeforeFile(null)
      setAfterFile(null)
      if (beforeRef.current) beforeRef.current.value = ''
      if (afterRef.current) afterRef.current.value = ''
      fetchItems()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    }

    setUploading(false)
  }

  async function handleDelete(item: BeforeAfterItem) {
    if (!confirm(`Delete "${item.title}"?`)) return
    await supabase.storage.from('photos').remove([item.before_path, item.after_path])
    await supabase.from('before_afters').delete().eq('id', item.id)
    fetchItems()
  }

  async function toggleActive(item: BeforeAfterItem) {
    await supabase.from('before_afters').update({ is_active: !item.is_active }).eq('id', item.id)
    fetchItems()
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
          <h1 className="font-serif text-3xl font-bold text-paper">Before & After</h1>
          <p className="font-body font-light text-muted text-sm mt-2">
            Upload before and after pairs to showcase your editing work on the homepage.
          </p>
        </div>

        {/* Upload form */}
        <div className="bg-off border border-paper/[0.06] p-6 md:p-8 mb-10 max-w-2xl">
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-6">Add New Pair</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Title</label>
              <input
                type="text"
                placeholder="e.g. Outdoor Portrait Edit"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Before Image</label>
                <div
                  onClick={() => beforeRef.current?.click()}
                  className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors cursor-pointer p-5 text-center"
                >
                  <p className="font-cond text-xs tracking-wider uppercase text-muted">
                    {beforeFile ? beforeFile.name : 'Select'}
                  </p>
                </div>
                <input ref={beforeRef} type="file" accept="image/*" onChange={e => setBeforeFile(e.target.files?.[0] ?? null)} className="hidden" />
              </div>

              <div className="space-y-2">
                <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">After Image</label>
                <div
                  onClick={() => afterRef.current?.click()}
                  className="border border-dashed border-paper/20 hover:border-gold/50 transition-colors cursor-pointer p-5 text-center"
                >
                  <p className="font-cond text-xs tracking-wider uppercase text-muted">
                    {afterFile ? afterFile.name : 'Select'}
                  </p>
                </div>
                <input ref={afterRef} type="file" accept="image/*" onChange={e => setAfterFile(e.target.files?.[0] ?? null)} className="hidden" />
              </div>
            </div>

            {error && <p className="font-cond text-xs tracking-wider text-red-400">{error}</p>}
            {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase py-3.5 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Add Pair'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3 max-w-2xl">
          <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
            All Pairs ({items.length})
          </p>
          {items.map(item => (
            <div key={item.id} className="bg-off border border-paper/[0.06] px-5 py-4 flex items-center justify-between gap-4">
              <p className={`font-body text-sm ${item.is_active ? 'text-paper' : 'text-muted line-through'}`}>
                {item.title}
              </p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(item)}
                  className={`font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                    item.is_active
                      ? 'border-green-400/30 text-green-400'
                      : 'border-paper/10 text-muted hover:border-green-400/30 hover:text-green-400'
                  }`}
                >
                  {item.is_active ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(item)}
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