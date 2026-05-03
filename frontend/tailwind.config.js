/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#21262d',
          blue: '#388bfd',
          green: '#3fb950',
          red: '#f85149',
          text: '#c9d1d9',
          muted: '#8b949e'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-spin': 'border-spin 3s linear infinite',
      },
      keyframes: {
        'border-spin': {
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
