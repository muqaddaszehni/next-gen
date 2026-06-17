/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0E1B2E',
        ink: '#1C1C1C',
        bone: '#F7F4EE',
        // A faintly warmer/cooler card surface drawn from the bone background
        parchment: '#FBF9F4',
        brass: '#B0904F',
        'brass-deep': '#8C7038',
        hairline: '#D8D2C6',
        'navy-soft': '#1A2C44',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.22em',
        wide: '0.08em',
      },
      maxWidth: {
        reading: '46rem',
        page: '72rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(14, 27, 46, 0.04), 0 12px 28px -18px rgba(14, 27, 46, 0.18)',
        lift: '0 2px 4px rgba(14, 27, 46, 0.06), 0 24px 48px -24px rgba(14, 27, 46, 0.28)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'draw-line': {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease both',
      },
    },
  },
  plugins: [],
}
