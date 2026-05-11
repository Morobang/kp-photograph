'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'

type BeforeAfterProps = {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden cursor-col-resize select-none"
      onMouseMove={onMouseMove}
      onMouseDown={() => { dragging.current = true }}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchMove={onTouchMove}
    >
      {/* After image (full width, behind) */}
      <div className="absolute inset-0">
        <Image src={after} alt={afterLabel} fill className="object-cover" sizes="100vw" />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${position}%` }}
      >
        <div className="relative w-full h-full" style={{ width: containerRef.current?.offsetWidth ?? '100%' }}>
          <Image src={before} alt={beforeLabel} fill className="object-cover" sizes="100vw" />
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/80 z-10"
        style={{ left: `${position}%` }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
          <svg width="16" height="16" fill="none" stroke="#0d0c0a" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M8 9l-4 3 4 3M16 9l4 3-4 3" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10">
        <span className="font-cond text-[0.65rem] tracking-[0.2em] uppercase bg-ink/70 text-paper px-2 py-1">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <span className="font-cond text-[0.65rem] tracking-[0.2em] uppercase bg-ink/70 text-paper px-2 py-1">
          {afterLabel}
        </span>
      </div>
    </div>
  )
}