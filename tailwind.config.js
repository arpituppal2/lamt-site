/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        uclaBlue: '#2774AE',
        uclaBlueDeep: '#003B5C',
        uclaGold: '#FFD100',
      },
    },
  },
  plugins: [],
};
