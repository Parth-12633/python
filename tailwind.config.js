/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Switzer', 'system-ui', 'sans-serif'],
        display: ['"Clash Display"', 'Switzer', 'system-ui', 'sans-serif'],
        serif: ['"Clash Display"', 'Switzer', 'sans-serif'],
        mono: ['Switzer', 'system-ui', 'sans-serif']
      },
      colors: {
        neon: '#B7FF00',
        ink: { 950: '#000000', 900: '#070707', 800: '#0e0e0e', 700: '#161616' },
        // legacy token names now all resolve to the single accent
        brand: { blue: '#B7FF00', violet: '#B7FF00', cyan: '#B7FF00' }
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'marquee-rev': { from: { transform: 'translateX(-50%)' }, to: { transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.15 } },
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-rev': 'marquee-rev 46s linear infinite',
        float: 'float 7s ease-in-out infinite',
        blink: 'blink 1.2s steps(2) infinite',
        'scroll-cue': 'scroll-cue 2s cubic-bezier(.6,0,.2,1) infinite'
      }
    }
  },
  plugins: []
};
