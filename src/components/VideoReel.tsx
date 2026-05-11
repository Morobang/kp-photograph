'use client'

import { useState, useRef } from 'react'

type Video = {
  id: string
  title: string
  storage_path: string
  thumbnail_path: string | null
}

export default function VideoReel({
  video,
  supabaseUrl,
}: {
  video: Video
  supabaseUrl: string
}) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videoUrl = `${supabaseUrl}/storage/v1/object/public/videos/${video.storage_path}`
  const thumbUrl = video.thumbnail_path
    ? `${supabaseUrl}/storage/v1/object/public/videos/${video.thumbnail_path}`
    : null

  function handlePlay() {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <div className="relative w-full aspect-video bg-ink overflow-hidden group">
      <video
        ref={videoRef}
        src={videoUrl}
        poster={thumbUrl ?? undefined}
        controls={playing}
        playsInline
        className="w-full h-full object-cover"
        onEnded={() => setPlaying(false)}
      />

      {/* Play overlay */}
      {!playing && (
        <div
          onClick={handlePlay}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-ink/60 group-hover:bg-ink/40 transition-all duration-500"
        >
          {/* Play button */}
          <div className="w-16 h-16 md:w-20 md:h-20 border border-gold/60 rounded-full flex items-center justify-center group-hover:border-gold group-hover:scale-110 transition-all duration-300 mb-4">
            <svg
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="text-gold ml-1"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="font-cond text-xs tracking-[0.25em] uppercase text-paper/60">
            {video.title}
          </p>
        </div>
      )}
    </div>
  )
}