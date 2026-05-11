import SectionLabel from '@/components/SectionLabel'
import Reveal from '@/components/Reveal'
import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="px-6 md:px-14 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <Reveal>
            <SectionLabel text="Book a Shoot" />
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-paper mb-4" style={{ lineHeight: 1.05 }}>
              Let's Plan<br />Your Shoot.
            </h1>
            <p className="font-body font-light text-muted text-sm md:text-base leading-relaxed mb-8 max-w-sm">
              Fill in the form and K.P will confirm your booking within 24 hours. For urgent bookings reach out on WhatsApp.
            </p>

            <div className="space-y-5">
              {[
                { step: '01', text: 'Submit your booking request below' },
                { step: '02', text: 'K.P confirms availability within 24hrs' },
                { step: '03', text: 'Pay deposit to lock in your date' },
                { step: '04', text: 'Show up and get great photos' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-4">
                  <span className="font-serif text-2xl font-black text-gold/20 w-8 flex-shrink-0">
                    {item.step}
                  </span>
                  <p className="font-body font-light text-muted text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <BookingForm />
          </Reveal>
        </div>
      </section>
    </div>
  )
}