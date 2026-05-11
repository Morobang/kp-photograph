'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_path: string | null
  is_published: boolean
  published_at: string | null
}

type ViewMode = 'list' | 'edit' | 'new'

export default function AdminBlogPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()

  const [posts, setPosts] = useState<Post[]>([])
  const [view, setView] = useState<ViewMode>('list')
  const [editing, setEditing] = useState<Partial<Post>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    setPosts(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchPosts()
  }, [authenticated])

  function toSlug(str: string) {
    return str.toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
  }

  function startNew() {
    setEditing({ title: '', slug: '', excerpt: '', content: '', is_published: false })
    setView('new')
  }

  function startEdit(post: Post) {
    setEditing(post)
    setView('edit')
  }

  async function handleSave() {
    if (!editing.title || !editing.content) return
    setSaving(true)
    setSuccess('')

    const slug = editing.slug || toSlug(editing.title)
    const payload = {
      title: editing.title,
      slug,
      excerpt: editing.excerpt ?? '',
      content: editing.content,
      is_published: editing.is_published ?? false,
      published_at: editing.is_published ? (editing.published_at ?? new Date().toISOString()) : null,
    }

    if (view === 'new') {
      await supabase.from('posts').insert(payload)
    } else {
      await supabase.from('posts').update(payload).eq('id', editing.id)
    }

    setSuccess('Saved!')
    setView('list')
    fetchPosts()
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function togglePublished(post: Post) {
    await supabase.from('posts').update({
      is_published: !post.is_published,
      published_at: !post.is_published ? new Date().toISOString() : null,
    }).eq('id', post.id)
    fetchPosts()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this post?')) return
    await supabase.from('posts').delete().eq('id', id)
    fetchPosts()
  }

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center text-muted font-cond text-xs tracking-widest uppercase">
      Loading...
    </div>
  )
  if (!authenticated) return null

  const inputClass = "w-full bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"

  // Edit / New view
  if (view === 'edit' || view === 'new') {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8 md:p-10 max-w-3xl">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setView('list')}
              className="font-cond text-xs tracking-wider uppercase text-muted hover:text-paper transition-colors"
            >
              ← Back
            </button>
            <h1 className="font-serif text-2xl font-bold text-paper">
              {view === 'new' ? 'New Post' : 'Edit Post'}
            </h1>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Title</label>
              <input
                type="text"
                placeholder="Post title..."
                value={editing.title ?? ''}
                onChange={e => setEditing(p => ({
                  ...p,
                  title: e.target.value,
                  slug: p.slug || toSlug(e.target.value)
                }))}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">Slug (URL)</label>
              <input
                type="text"
                value={editing.slug ?? ''}
                onChange={e => setEditing(p => ({ ...p, slug: e.target.value }))}
                className={`${inputClass} font-mono text-xs`}
              />
              <p className="font-body text-xs text-muted/50">
                Will be: /journal/{editing.slug || 'your-slug-here'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
                Excerpt (short summary)
              </label>
              <textarea
                rows={2}
                placeholder="A short description shown on the journal listing page..."
                value={editing.excerpt ?? ''}
                onChange={e => setEditing(p => ({ ...p, excerpt: e.target.value }))}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted">
                Content
              </label>
              <textarea
                rows={16}
                placeholder="Write your post here... Use double line breaks for paragraphs."
                value={editing.content ?? ''}
                onChange={e => setEditing(p => ({ ...p, content: e.target.value }))}
                className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="published"
                checked={editing.is_published ?? false}
                onChange={e => setEditing(p => ({ ...p, is_published: e.target.checked }))}
                className="accent-gold"
              />
              <label htmlFor="published" className="font-cond text-xs tracking-wider uppercase text-muted">
                Publish immediately (visible on site)
              </label>
            </div>

            {success && <p className="font-cond text-xs tracking-wider text-green-400">{success}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-8 py-3.5 hover:bg-gold-light transition-colors disabled:opacity-40"
              >
                {saving ? 'Saving...' : 'Save Post'}
              </button>
              <button
                onClick={() => setView('list')}
                className="font-cond text-xs tracking-[0.2em] uppercase px-6 py-3.5 border border-paper/10 text-muted hover:text-paper transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
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
            <h1 className="font-serif text-3xl font-bold text-paper">Blog / Journal</h1>
          </div>
          <button
            onClick={startNew}
            className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-6 py-3 hover:bg-gold-light transition-colors"
          >
            + New Post
          </button>
        </div>

        {success && <p className="font-cond text-xs tracking-wider text-green-400 mb-6">{success}</p>}

        {posts.length === 0 ? (
          <p className="font-body font-light text-muted text-sm">No posts yet. Write your first one!</p>
        ) : (
          <div className="space-y-3 max-w-3xl">
            {posts.map(post => (
              <div key={post.id} className="bg-off border border-paper/[0.06] p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-serif text-base font-bold text-paper truncate">{post.title}</p>
                    <span className={`font-cond text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border flex-shrink-0 ${
                      post.is_published
                        ? 'border-green-400/30 text-green-400'
                        : 'border-paper/10 text-muted'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="font-body font-light text-muted text-xs leading-relaxed line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                  <p className="font-mono text-[0.6rem] text-muted/40 mt-1">/journal/{post.slug}</p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(post)}
                    className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-gold/30 hover:text-gold transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePublished(post)}
                    className={`font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                      post.is_published
                        ? 'border-paper/10 text-muted hover:border-red-400/30 hover:text-red-400'
                        : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                    }`}
                  >
                    {post.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border border-paper/10 text-muted hover:border-red-400/50 hover:text-red-400 transition-colors"
                  >
                    Delete
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