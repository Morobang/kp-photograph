'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/useAuth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { createBrowserClient } from '@/lib/supabase-admin-client'
import { Category } from '@/lib/types'

export default function AdminCategoriesPage() {
  const { loading, authenticated } = useAuth()
  const supabase = createBrowserClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    setCategories(data ?? [])
  }

  useEffect(() => {
    if (authenticated) fetchCategories()
  }, [authenticated])

  function toSlug(str: string) {
    return str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  }

  async function handleAdd() {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    setSuccess('')

    const slug = toSlug(name)
    const maxOrder = Math.max(0, ...categories.map(c => c.sort_order))

    const { error: err } = await supabase
      .from('categories')
      .insert({ name: name.trim(), slug, sort_order: maxOrder + 1 })

    if (err) {
      setError(err.message.includes('unique') ? 'That category already exists.' : err.message)
    } else {
      setSuccess(`"${name.trim()}" added!`)
      setName('')
      fetchCategories()
    }
    setSaving(false)
    setTimeout(() => setSuccess(''), 3000)
  }

  async function toggleActive(cat: Category) {
    await supabase
      .from('categories')
      .update({ is_active: !cat.is_active })
      .eq('id', cat.id)
    fetchCategories()
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? Photos in this category won't be deleted but will lose their category label.`)) return
    await supabase.from('categories').delete().eq('id', cat.id)
    fetchCategories()
  }

  async function moveUp(cat: Category, index: number) {
    if (index === 0) return
    const above = categories[index - 1]
    await supabase.from('categories').update({ sort_order: above.sort_order }).eq('id', cat.id)
    await supabase.from('categories').update({ sort_order: cat.sort_order }).eq('id', above.id)
    fetchCategories()
  }

  async function moveDown(cat: Category, index: number) {
    if (index === categories.length - 1) return
    const below = categories[index + 1]
    await supabase.from('categories').update({ sort_order: below.sort_order }).eq('id', cat.id)
    await supabase.from('categories').update({ sort_order: cat.sort_order }).eq('id', below.id)
    fetchCategories()
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
          <h1 className="font-serif text-3xl font-bold text-paper">Categories</h1>
          <p className="font-body font-light text-muted text-sm mt-2">
            Add as many categories as you need — they appear as filter tabs in the gallery automatically.
          </p>
        </div>

        {/* Add new */}
        <div className="bg-off border border-paper/[0.06] p-6 mb-10 max-w-lg">
          <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-5">Add New Category</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Wedding, Street, Matric..."
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              className="flex-1 bg-paper/[0.03] border border-paper/10 text-paper placeholder:text-muted font-body font-light text-sm px-4 py-3 focus:outline-none focus:border-gold transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={saving || !name.trim()}
              className="bg-gold text-ink font-cond text-xs font-semibold tracking-[0.2em] uppercase px-5 py-3 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              {saving ? '...' : 'Add'}
            </button>
          </div>
          {error && <p className="font-cond text-xs tracking-wider text-red-400 mt-3">{error}</p>}
          {success && <p className="font-cond text-xs tracking-wider text-green-400 mt-3">{success}</p>}
        </div>

        {/* Categories list */}
        <div className="max-w-lg space-y-2">
          <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-4">
            All Categories ({categories.length})
          </p>
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className="bg-off border border-paper/[0.06] px-5 py-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveUp(cat, index)}
                    disabled={index === 0}
                    className="text-muted hover:text-paper disabled:opacity-20 transition-colors"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveDown(cat, index)}
                    disabled={index === categories.length - 1}
                    className="text-muted hover:text-paper disabled:opacity-20 transition-colors"
                  >
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div>
                  <p className={`font-cond text-sm tracking-wide ${cat.is_active ? 'text-paper' : 'text-muted line-through'}`}>
                    {cat.name}
                  </p>
                  <p className="font-mono text-[0.6rem] text-muted/50 mt-0.5">
                    slug: {cat.slug}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleActive(cat)}
                  className={`font-cond text-[0.6rem] tracking-wider uppercase px-3 py-1.5 border transition-colors ${
                    cat.is_active
                      ? 'border-green-400/30 text-green-400 hover:border-paper/20 hover:text-muted'
                      : 'border-paper/10 text-muted hover:border-green-400/30 hover:text-green-400'
                  }`}
                >
                  {cat.is_active ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleDelete(cat)}
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