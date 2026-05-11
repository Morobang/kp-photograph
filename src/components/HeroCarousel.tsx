'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Photo } from '@/lib/types'

export default function HeroCarousel({
  photos,
  supabaseUrl,
}: {
  photos: Photo[]
  supabaseUrl: string
}) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % photos.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [photos.length])

  if (photos.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {photos.map((photo, i) => (
        <div
          key={photo.id}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={`${supabaseUrl}/storage/v1/object/public/photos/${photo.storage_path}`}
            alt={photo.title}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
          {/* Dark overlay so text stays readable */}
          <div className="absolute inset-0 bg-ink/70" />
        </div>
      ))}

      {/* Slide indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-8 right-8 flex gap-1.5 z-10">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 ${
                i === current ? 'w-6 h-px bg-gold' : 'w-2 h-px bg-paper/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}