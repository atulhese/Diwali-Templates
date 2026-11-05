/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          dark: '#120406',
          maroon: '#4a0814',
          crimson: '#821020',
          orange: '#ea580c',
          gold: '#f59e0b',
          amber: '#fbbf24',
          lightGold: '#fef3c7',
          purple: '#3b0764'
        }
      },
      animation: {
        'flame-flicker': 'flicker 1.5s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-1deg)', filter: 'drop-shadow(0 0 10px #fbbf24)' },
          '50%': { transform: 'scale(1.15) rotate(1deg)', filter: 'drop-shadow(0 0 18px #ea580c)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(245, 158, 11, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
