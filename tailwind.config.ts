import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0c0a',
        off: '#1a1915',
        mid: '#2e2c27',
        muted: '#6b6658',
        paper: '#f5f0e8',
        gold: {
          DEFAULT: '#c9962a',
          light: '#e8b84b',
          dim: '#7a5a12',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        cond: ['var(--font-barlow-condensed)', 'sans-serif'],
        body: ['var(--font-barlow)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config