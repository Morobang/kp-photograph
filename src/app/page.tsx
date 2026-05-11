import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Photo, Service } from '@/lib/types'
import Gallery from '@/components/Gallery'
import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import HeroCarousel from '@/components/HeroCarousel'
import Testimonials from '@/components/Testimonials'
import VideoReel from '@/components/VideoReel'
import BeforeAfter from '@/components/BeforeAfter'
import JournalTeaser from '@/components/JournalTeaser'

async function getFeaturedPhotos(): Promise<Photo[]> {
  const { data } = await supabase
    .from('photos')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })
    .limit(6)
  return data ?? []
}

async function getFeaturedVideo() {
  const { data } = await supabase
    .from('videos')
    .select('*')
    .eq('is_featured', true)
    .single()
  return data ?? null
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}
async function getBeforeAfters() {
  const { data } = await supabase
    .from('before_afters')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(3)
  return data ?? []
}

async function getAllPhotos(): Promise<Photo[]> {
  const { data } = await supabase
    .from('photos')
    .select('*')
    .order('sort_order', { ascending: true })
  return data ?? []
}

async function getServices(): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

async function getTestimonials() {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function HomePage() {
const [featuredPhotos, allPhotos, services, testimonials, categories, featuredVideo, beforeAfters] =
  await Promise.all([
    getFeaturedPhotos(),
    getAllPhotos(),
    getServices(),
    getTestimonials(),
    getCategories(),
    getFeaturedVideo(),
    getBeforeAfters(),
  ])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  return (
    <>
      {/* ── HERO ── */}
<section className="relative min-h-screen flex flex-col justify-end px-4 sm:px-6 md:px-14 pb-16 md:pb-24 overflow-hidden">
  {/* Enhanced background with animated gradient and glow */}
  <div className="absolute inset-0 bg-gradient-to-br from-ink via-off to-ink">
    {/* Animated gradient orb */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-gold/5 blur-[100px] animate-pulse-slow" />
    <div className="absolute top-1/3 right-0 w-[60vw] h-[60vw] max-w-[400px] max-h-[400px] rounded-full bg-gold-light/3 blur-[80px] animate-pulse-slower" />
    
    {/* Diagonal light rays */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-gold/0 via-gold/20 to-transparent animate-sweep" />
      <div className="absolute top-0 left-[50%] w-px h-full bg-gradient-to-b from-gold/0 via-gold/10 to-transparent animate-sweep-delayed" />
      <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-gold/0 via-gold/15 to-transparent animate-sweep-slower" />
    </div>
  </div>

  {/* Grid pattern overlay */}
  <div 
    className="absolute inset-0 opacity-[0.02] pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(rgba(201,150,42,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(201,150,42,0.1) 1px, transparent 1px)`,
      backgroundSize: '40px 40px'
    }}
  />

  {/* Decorative floating particles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-gold/10 animate-float"
        style={{
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${Math.random() * 10 + 10}s`
        }}
      />
    ))}
  </div>

  {/* Ghost letterform with glow */}
  {featuredPhotos.length === 0 && (
    <>
      <span
        className="absolute right-0 top-1/2 -translate-y-1/2 font-serif font-black text-[55vw] leading-none pointer-events-none select-none animate-pulse-glow"
        style={{ 
          color: 'transparent', 
          WebkitTextStroke: '1px rgba(201,150,42,0.08)',
          textShadow: '0 0 30px rgba(201,150,42,0.1)'
        }}
      >
        K
      </span>
      {/* Additional decorative letter */}
      <span
        className="absolute left-0 bottom-1/4 font-serif font-black text-[30vw] leading-none pointer-events-none select-none opacity-5"
        style={{ 
          color: 'transparent', 
          WebkitTextStroke: '1px rgba(201,150,42,0.05)',
        }}
      >
        P
      </span>
    </>
  )}

  {/* Featured photos fallback - cinematic placeholder */}
  {featuredPhotos.length === 0 && (
    <div className="absolute inset-0 bg-gradient-to-br from-ink via-off to-ink opacity-60">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <div className="absolute inset-0 border-2 border-gold/20 rounded-full animate-spin-slow" />
          <div className="absolute inset-[15%] border border-gold/10 rounded-full animate-spin-slower" />
          <div className="absolute inset-[30%] bg-gold/5 rounded-full animate-pulse-slow blur-md" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-6xl md:text-7xl text-gold/20 animate-pulse">◈</span>
          </div>
        </div>
      </div>
    </div>
  )}

  <div className="relative z-10 max-w-3xl animate-fade-up">
    <p className="flex items-center gap-3 font-cond text-[0.7rem] tracking-[0.3em] uppercase text-gold/80 mb-5 delay-1">
      <span className="block w-8 h-px bg-gold/60" />
      Photography & Visual Storytelling
    </p>

    {/* Responsive heading with better mobile handling */}
    <h1
      className="font-serif font-black leading-[0.9] tracking-tight mb-6 animate-fade-up delay-2"
      style={{ fontSize: 'clamp(2.5rem, 8vw, 8rem)' }}
    >
      <span className="text-gold-light inline-block hover:scale-105 transition-transform duration-300">
        K.P_PHO
      </span>
      <span className="text-paper/70 inline-block break-words">
        TOGraph
      </span>
    </h1>

    <p
      className="font-cond font-light tracking-[0.3em] uppercase text-paper/40 mb-10 animate-fade-up delay-3"
      style={{ fontSize: 'clamp(0.7rem, 2vw, 1.2rem)' }}
    >
      Ri Khou Lingedza
    </p>

    <div className="flex flex-wrap items-center gap-4 animate-fade-up delay-4">
      <Link
        href="#portfolio"
        className="group relative inline-flex items-center gap-3 border border-gold/60 px-6 md:px-8 py-3 md:py-4 font-cond text-xs tracking-[0.2em] uppercase text-gold hover:text-ink transition-all duration-300 overflow-hidden"
      >
        <span className="relative z-10">View Work</span>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="relative z-10 group-hover:translate-x-1 transition-transform">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
        <span className="absolute inset-0 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 font-cond text-xs tracking-[0.2em] uppercase text-paper/40 hover:text-gold-light transition-all duration-300 hover:gap-3"
      >
        Book a Shoot →
      </Link>
    </div>
  </div>

  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in delay-5 z-10">
    <span className="font-cond text-[0.6rem] tracking-[0.3em] uppercase text-paper/20">Scroll</span>
    <span className="block w-px h-10 bg-gradient-to-b from-paper/20 to-transparent animate-scroll-pulse" />
  </div>
</section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="bg-off px-6 md:px-14 py-20 md:py-28">
        <Reveal>
          <SectionLabel text="Work" />
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-3" style={{ lineHeight: 1.1 }}>
            Portfolio
          </h2>
          <p className="font-body font-light text-muted text-sm md:text-base leading-relaxed max-w-lg mb-10 md:mb-14">
            A selection of moments captured — portraits, events, landscapes and editorial work from across South Africa.
          </p>
        </Reveal>
        <Reveal delay={150}>
          <Gallery photos={allPhotos} categories={categories} />
        </Reveal>
      </section>


      {/* ── VIDEO REEL ── */}
      {featuredVideo && (
        <section className="bg-ink px-6 md:px-14 py-20 md:py-28">
          <Reveal>
            <SectionLabel text="Showreel" />
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-3" style={{ lineHeight: 1.1 }}>
              Watch the Work
            </h2>
            <p className="font-body font-light text-muted text-sm leading-relaxed max-w-lg mb-10">
              A glimpse into the shoots, the moments, and the craft behind the lens.
            </p>
            <div className="max-w-4xl">
              <VideoReel video={featuredVideo} supabaseUrl={supabaseUrl} />
            </div>
          </Reveal>
        </section>
      )}

      {/* ── BEFORE / AFTER ── */}
      {beforeAfters.length > 0 && (
        <section className="bg-off px-6 md:px-14 py-20 md:py-28">
          <Reveal>
            <SectionLabel text="The Edit" />
            <h2 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-3" style={{ lineHeight: 1.1 }}>
              Before & After
            </h2>
            <p className="font-body font-light text-muted text-sm leading-relaxed max-w-lg mb-12">
              The difference a skilled edit makes. Drag the slider to see the transformation.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beforeAfters.map(item => (
                <div key={item.id}>
                  <BeforeAfter
                    before={`${supabaseUrl}/storage/v1/object/public/photos/${item.before_path}`}
                    after={`${supabaseUrl}/storage/v1/object/public/photos/${item.after_path}`}
                  />
                  <p className="font-cond text-xs tracking-[0.15em] uppercase text-muted mt-3">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      )}
      {/* ── SERVICES ── */}
      <section className="bg-ink px-6 md:px-14 py-20 md:py-28">
        <Reveal>
          <SectionLabel text="Services" />
          <h2 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-3" style={{ lineHeight: 1.1 }}>
            What I Shoot
          </h2>
          <p className="font-body font-light text-muted text-sm leading-relaxed max-w-lg mb-12 md:mb-16">
            Flexible packages for every occasion. Reach out for a custom quote.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-3 border border-paper/[0.06]">
            {services.map((service, i) => (
              <div
                key={service.id}
                className="group relative bg-ink p-8 md:p-10 border-b md:border-b-0 md:border-r border-paper/[0.06] last:border-0 hover:bg-mid transition-colors duration-300"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="font-serif text-5xl md:text-6xl font-black text-gold/10 leading-none mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <p className="font-cond text-base font-semibold tracking-[0.08em] uppercase text-paper mb-3">
                  {service.name}
                </p>
                <p className="font-body font-light text-muted text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <p className="font-serif text-2xl font-bold text-gold-light">
                  <span className="font-cond text-xs font-normal tracking-widest uppercase text-muted mr-2">From</span>
                  R{service.price_from.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center md:justify-start">
            <Link
              href="/services"
              className="font-cond text-xs tracking-[0.2em] uppercase text-gold border border-gold/40 px-6 py-3 hover:bg-gold hover:text-ink transition-all duration-300"
            >
              View All Packages →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <section className="bg-off px-6 md:px-14 py-20 md:py-28">
          <Reveal>
            <div className="text-center mb-12">
              <SectionLabel text="Kind Words" />
              <h2 className="font-serif font-bold text-3xl md:text-5xl text-paper mt-3" style={{ lineHeight: 1.1 }}>
                What Clients Say
              </h2>
            </div>
            <Testimonials testimonials={testimonials} />
          </Reveal>
        </section>
      )}

      {/* ── JOURNAL TEASER ── */}
      <JournalTeaser supabaseUrl={supabaseUrl} />

      {/* ── CTA STRIP ── */}
      <section className="bg-gold px-6 md:px-14 py-14 md:py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-cond text-[0.7rem] tracking-[0.3em] uppercase text-ink/60 mb-2">Ready?</p>
            <h2 className="font-serif font-black text-2xl md:text-4xl text-ink leading-tight">
              Let's make something<br className="hidden md:block" /> worth keeping.
            </h2>
          </div>
          <Link
            href="/contact"
            className="flex-shrink-0 inline-flex items-center gap-3 bg-ink text-gold font-cond text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-off transition-colors duration-300"
          >
            Book a Shoot
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}