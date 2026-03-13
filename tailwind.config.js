/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#06060e',
        surface2: '#0a0a12',
        surface3: '#0d0a1a',
        card: 'rgba(255,255,255,0.038)',
        border: 'rgba(212,175,55,0.2)',
        gold: '#d4af37',
        'gold-light': '#f5e18a',
        'gold-dim': 'rgba(212,175,55,0.65)',
        text: '#f0e6c8',
        'text-dim': 'rgba(240,230,200,0.5)',
        'text-faint': 'rgba(240,230,200,0.22)',
      },
      maxWidth: {
        mobile: '480px',
      },
      animation: {
        'spin-slow': 'spin 22s linear infinite',
        'spin-slow-reverse': 'spin-reverse 15s linear infinite',
        'spin-medium': 'spin 9s linear infinite',
        'orb-dot': 'orb-dot 9s linear infinite',
        'pulse-glow': 'pulse-glow 2.8s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(-360deg)' },
        },
        'orb-dot': {
          '0%': { transform: 'rotate(0deg) translateX(88px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(88px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.9', transform: 'translate(-50%,-50%) scale(1)' },
          '50%': { opacity: '1', transform: 'translate(-50%,-50%) scale(1.12)' },
        },
      },
    },
  },
  plugins: [],
}
