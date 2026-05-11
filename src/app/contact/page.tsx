import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import ContactForm from '@/components/ContactForm'

const contactDetails = [
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      </svg>
    ),
    label: 'Email',
    value: 'kp.photograph@gmail.com',
    href: 'mailto:kp.photograph@gmail.com',
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.68 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.52 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.93a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: 'WhatsApp / Call',
    value: '+27 XX XXX XXXX',
    href: 'https://wa.me/27000000000',
  },
  {
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    label: 'Instagram',
    value: '@kp_photograph',
    href: 'https://instagram.com/kp_photograph',
  },
]

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left info */}
          <Reveal>
            <SectionLabel text="Contact" />
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-paper mb-4" style={{ lineHeight: 1.05 }}>
              Let's Make<br />Something.
            </h1>
            <p className="font-body font-light text-muted text-sm md:text-base leading-relaxed mb-12 max-w-sm">
              Have a vision? Let's talk. Fill in the form or reach out directly — K.P responds within 24 hours.
            </p>

            <div className="space-y-7">
              {contactDetails.map(item => (
                
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-5"
                >
                  <div className="w-11 h-11 border border-gold/30 flex items-center justify-center flex-shrink-0 text-gold group-hover:bg-gold group-hover:text-ink transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-cond text-[0.65rem] tracking-[0.2em] uppercase text-muted mb-1">
                      {item.label}
                    </p>
                    <p className="font-body font-light text-paper text-sm group-hover:text-gold-light transition-colors duration-200">
                      {item.value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          {/* Right form */}
          <Reveal delay={150}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  )
}