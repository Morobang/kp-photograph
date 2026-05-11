import type { Metadata } from 'next'
import { Playfair_Display, Barlow_Condensed, Barlow } from 'next/font/google'
import './globals.css'
import ConditionalLayout from '@/components/ConditionalLayout'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-barlow-condensed',
})

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-barlow',
})

export const metadata: Metadata = {
  title: 'K.P_PHOTOGRAPH | Ri Khou Lingedza',
  description: 'South African visual storyteller. Portraits, events, editorial and commercial photography.',
  openGraph: {
    title: 'K.P_PHOTOGRAPH',
    description: 'Ri Khou Lingedza — We Capture It.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${barlowCondensed.variable} ${barlow.variable}`}>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  )
}