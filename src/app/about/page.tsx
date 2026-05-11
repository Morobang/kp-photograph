import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import Link from 'next/link'

const stats = [
  { num: '5+', label: 'Years Active' },
  { num: '200+', label: 'Sessions Done' },
  { num: '3', label: 'Provinces' },
  { num: 'ZA', label: 'Based In SA' },
]

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="px-6 md:px-14 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Photo placeholder */}
          <Reveal className="relative">
            <div className="relative aspect-[3/4] bg-mid overflow-hidden max-w-sm mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e1a14] to-[#2e2418]" />
              <div
                className="absolute bottom-5 left-5 font-serif font-black text-gold/30"
                style={{ fontSize: 'clamp(2rem, 6vw, 3rem)' }}
              >
                K.P
              </div>
              {/* Accent frame */}
              <div className="absolute -bottom-4 -right-4 w-3/5 h-3/5 border border-gold/10 -z-10" />
            </div>
          </Reveal>

          {/* Text */}
          <Reveal delay={150}>
            <SectionLabel text="About" />
            <h1 className="font-serif font-bold text-3xl md:text-5xl text-paper mb-6" style={{ lineHeight: 1.1 }}>
              The Eye Behind<br />the Lens
            </h1>
            <p className="font-body font-light text-muted text-sm md:text-base leading-[1.9] mb-4">
              K.P_PHOTOGraph is a South African visual storyteller with a passion for authentic moments — the kind that don't wait to be framed, they demand to be seized.
            </p>
            <p className="font-body font-light text-muted text-sm md:text-base leading-[1.9] mb-4">
              From intimate portraits in Limpopo to high-energy events across Gauteng, every shoot is guided by one principle:
            </p>
            <p className="font-serif text-xl md:text-2xl text-gold-light italic mb-8">
              "Ri Khou Lingedza — We Capture It."
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-paper/[0.08]">
              {stats.map(s => (
                <div key={s.label}>
                  <p className="font-serif text-3xl md:text-4xl font-bold text-gold-light leading-none mb-1">
                    {s.num}
                  </p>
                  <p className="font-cond text-[0.65rem] tracking-[0.15em] uppercase text-muted">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-off px-6 md:px-14 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionLabel text="Approach" />
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-paper mb-12" style={{ lineHeight: 1.1 }}>
              How I Work
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'Listen First', body: 'Every shoot starts with understanding what you want to feel when you look at the photos. Your story drives everything.' },
              { num: '02', title: 'Light & Moment', body: 'Natural or controlled, the light sets the mood. Patient observation turns ordinary scenes into extraordinary frames.' },
              { num: '03', title: 'Deliver With Care', body: 'Fully retouched, thoughtfully selected. Every image in your gallery earned its place.' },
            ].map(item => (
              <Reveal key={item.num}>
                <p className="font-serif text-5xl font-black text-gold/10 leading-none mb-4">{item.num}</p>
                <p className="font-cond text-base font-semibold tracking-wide uppercase text-paper mb-3">{item.title}</p>
                <p className="font-body font-light text-muted text-sm leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-14 py-20 md:py-28 text-center">
        <Reveal>
          <p className="font-cond text-xs tracking-[0.3em] uppercase text-gold mb-4">Ready to work together?</p>
          <h2 className="font-serif font-black text-3xl md:text-5xl text-paper mb-8">Let's make something.</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-gold px-8 py-4 font-cond text-xs tracking-[0.2em] uppercase text-gold hover:bg-gold hover:text-ink transition-all duration-300"
          >
            Get In Touch
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </section>
    </div>
  )
}