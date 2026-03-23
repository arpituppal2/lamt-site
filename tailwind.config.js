/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uclaBlue: '#006994',
        deepNavy: '#0A192F',
        gold: '#FFB300',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(255,179,0,0.6)',
        'glow-blue': '0 0 20px rgba(0,105,148,0.5)',
      },
      animation: {
        'float-slow': 'floatSlow 20s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        spring: 'spring 0.3s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        floatSlow: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(5deg)' },
          '66%': { transform: 'translateY(10px) rotate(-3deg)' },
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 10px rgba(255,179,0,0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255,179,0,0.9)' },
        },
        spring: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.07)' },
          '100%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
};
