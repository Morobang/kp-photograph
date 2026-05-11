'use client'

import { useState } from 'react'

type Testimonial = {
  id: string
  client_name: string
  service: string
  quote: string
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0)

  if (testimonials.length === 0) return null

  const t = testimonials[active]

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Quote */}
      <div className="relative mb-8">
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-8xl text-gold/10 leading-none select-none">
          "
        </span>
        <p className="font-serif text-xl md:text-2xl text-paper/80 italic leading-relaxed relative z-10">
          "{t.quote}"
        </p>
      </div>

      {/* Author */}
      <p className="font-cond text-sm font-semibold tracking-[0.1em] uppercase text-paper mb-1">
        {t.client_name}
      </p>
      <p className="font-cond text-xs tracking-[0.15em] uppercase text-gold">
        {t.service}
      </p>

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 ${
                i === active
                  ? 'w-6 h-px bg-gold'
                  : 'w-2 h-px bg-paper/20 hover:bg-paper/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}