/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#ffffff',
        surface2: '#fafafa',
        card: '#ffffff',
        border: '#000000',
        text: '#000000',
        'text-dim': '#333333',
        'text-faint': '#666666',
        point: '#838ba2',
        'point-alt': '#0463a7',
        'point-dim': '#485160',
        'point-alt-dim': '#0351a6',
      },
      maxWidth: {
        mobile: '480px',
      },
      animation: {
        'fade-in': 'fade-in 0.35s ease-out',
        'loading-scale': 'loading-scale 1.8s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'loading-scale': {
          '0%, 100%': { transform: 'scale(0.88)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}
