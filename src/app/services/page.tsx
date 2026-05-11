import { supabase } from '@/lib/supabase'
import { Service } from '@/lib/types'
import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import Link from 'next/link'

async function getServices(): Promise<Service[]> {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return data ?? []
}

const included = [
  'Pre-shoot consultation',
  'Professional editing & retouching',
  'Private online gallery',
  'Commercial usage rights',
  'Quick 5–7 day turnaround',
]

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="pt-24 md:pt-32">
      <section className="px-6 md:px-14 pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <SectionLabel text="Services" />
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-paper mb-4" style={{ lineHeight: 1.05 }}>
              What I Shoot
            </h1>
            <p className="font-body font-light text-muted text-sm md:text-base leading-relaxed max-w-xl mb-16 md:mb-20">
              Every package is built around your vision. Reach out for a custom quote if your needs fall outside these.
            </p>
          </Reveal>

          {/* Service cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-paper/[0.06]">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 100}>
                <div className="group bg-ink h-full p-8 md:p-10 hover:bg-mid transition-colors duration-300 flex flex-col">
                  <p className="font-serif text-6xl font-black text-gold/10 leading-none mb-8">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-cond text-lg font-semibold tracking-[0.06em] uppercase text-paper mb-4">
                    {service.name}
                  </p>
                  <p className="font-body font-light text-muted text-sm leading-relaxed mb-8 flex-1">
                    {service.description}
                  </p>
                  <div className="pt-6 border-t border-paper/[0.08]">
                    <p className="font-cond text-[0.65rem] tracking-widest uppercase text-muted mb-1">Starting from</p>
                    <p className="font-serif text-3xl font-bold text-gold-light">
                      R{service.price_from.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* What's always included */}
          <Reveal delay={200}>
            <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <SectionLabel text="Always Included" />
                <h2 className="font-serif font-bold text-2xl md:text-3xl text-paper mb-8">
                  Every package comes with:
                </h2>
                <ul className="space-y-4">
                  {included.map(item => (
                    <li key={item} className="flex items-center gap-4">
                      <span className="block w-4 h-px bg-gold flex-shrink-0" />
                      <span className="font-body font-light text-muted text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-off border border-paper/[0.06] p-8">
                <p className="font-cond text-xs tracking-[0.2em] uppercase text-gold mb-3">Need something custom?</p>
                <h3 className="font-serif text-2xl font-bold text-paper mb-4">
                  Let's talk about your project.
                </h3>
                <p className="font-body font-light text-muted text-sm leading-relaxed mb-6">
                  Corporate campaigns, multi-day coverage, destination shoots — get in touch and we'll put together a package that fits.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 bg-gold text-ink font-cond text-xs tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-gold-light transition-colors duration-300"
                >
                  Send an Enquiry
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}