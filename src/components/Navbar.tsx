'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const links = [
  { href: '/#portfolio', label: 'Portfolio' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/journal', label: 'Journal' },
  { href: '/booking', label: 'Book' },
  { href: '/contact', label: 'Contact' },
]
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close menu on route change / resize
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-ink/95 backdrop-blur-sm border-b border-paper/5' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-5">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-0 font-cond tracking-widest text-sm">
            <span className="font-semibold text-gold-light">K.P_PHO</span>
            <span className="font-light text-paper/80">TOGRAPH</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-cond text-xs font-normal tracking-[0.2em] uppercase text-paper/50 hover:text-gold-light transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>


          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 border border-gold/50 px-5 py-2 font-cond text-xs tracking-[0.18em] uppercase text-gold hover:bg-gold hover:text-ink transition-all duration-300"
          >
            Book a Shoot
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 z-50"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-paper transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-px bg-paper transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-paper transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink flex flex-col justify-center items-center gap-10 transition-all duration-500 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="font-serif text-3xl font-bold text-paper/80 hover:text-gold-light transition-colors"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          className="mt-4 border border-gold px-8 py-3 font-cond text-sm tracking-[0.2em] uppercase text-gold hover:bg-gold hover:text-ink transition-all duration-300"
        >
          Book a Shoot
        </Link>
      </div>
    </>
  )
}