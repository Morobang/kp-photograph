'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Photo, Category } from '@/lib/types'
import { getPhotoUrl } from '@/lib/supabase'

export default function Gallery({
  photos,
  categories,
}: {
  photos: Photo[]
  categories: Category[]
}) {
  const [active, setActive] = useState('all')
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const filtered = active === 'all'
    ? photos
    : photos.filter(p => p.category.toLowerCase() === active.toLowerCase())

  function openLightbox(photo: Photo, index: number) {
    setLightbox(photo)
    setLightboxIndex(index)
  }

  function prev() {
    const newIndex = (lightboxIndex - 1 + filtered.length) % filtered.length
    setLightbox(filtered[newIndex])
    setLightboxIndex(newIndex)
  }

  function next() {
    const newIndex = (lightboxIndex + 1) % filtered.length
    setLightbox(filtered[newIndex])
    setLightboxIndex(newIndex)
  }

  return (
    <>
      {/* Filter tabs — dynamic from Supabase */}
      <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
        <button
          onClick={() => setActive('all')}
          className={`font-cond text-[0.7rem] font-medium tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
            active === 'all'
              ? 'border-gold text-gold-light bg-gold/5'
              : 'border-paper/10 text-paper/40 hover:border-gold/50 hover:text-gold/70'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActive(cat.slug)}
            className={`font-cond text-[0.7rem] font-medium tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
              active === cat.slug
                ? 'border-gold text-gold-light bg-gold/5'
                : 'border-paper/10 text-paper/40 hover:border-gold/50 hover:text-gold/70'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-muted font-cond tracking-widest uppercase text-sm">
          No photos in this category yet
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-1 space-y-1">
          {filtered.map((photo, index) => (
            <div
              key={photo.id}
              onClick={() => openLightbox(photo, index)}
              className="group relative overflow-hidden cursor-pointer break-inside-avoid bg-mid"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={getPhotoUrl(photo.storage_path)}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-5">
                <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-gold mb-1">
                  {photo.category}
                </p>
                <p className="font-serif text-paper text-base md:text-lg font-normal">
                  {photo.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox with navigation */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/97 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-paper/60 hover:text-paper font-cond text-xs tracking-widest uppercase flex items-center gap-2 z-10"
          >
            <span className="text-lg">×</span> Close
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-5 font-cond text-xs tracking-widest text-muted">
            {lightboxIndex + 1} / {filtered.length}
          </div>

          {/* Prev arrow */}
          {filtered.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 border border-paper/20 flex items-center justify-center text-paper/60 hover:border-gold hover:text-gold transition-all duration-200 z-10"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Next arrow */}
          {filtered.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 border border-paper/20 flex items-center justify-center text-paper/60 hover:border-gold hover:text-gold transition-all duration-200 z-10"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl w-full max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-[75vh]">
              <Image
                src={getPhotoUrl(lightbox.storage_path)}
                alt={lightbox.title}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-serif text-paper text-base md:text-lg">{lightbox.title}</p>
              <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-gold">
                {lightbox.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}