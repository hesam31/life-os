import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: {
          50:  '#eef0ff',
          100: '#dde2ff',
          200: '#c4cbff',
          300: '#a1acff',
          400: '#7b84fc',
          500: '#5a5ef7',
          600: '#4540ec',
          700: '#3a33d1',
          800: '#302ba8',
          900: '#0f0f2d',
          950: '#07071a',
        },
        slate: {
          750: '#2a3349',
          850: '#151e33',
          925: '#0d1526',
        },
        indigo: {
          electric: '#6366f1',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'slide-in':   'slideIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },                          to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn: { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
