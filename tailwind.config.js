/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        empoway: {
          terracotta: '#B96F54',
          'terracotta-dark': '#9c5941',
          'terracotta-light': '#ca866e',
          peach: '#E9A58D',
          blush: '#F4D7CE',
          cream: '#F8EEE5',
          coffee: '#684638',
          'coffee-dark': '#4e3328',
          caramel: '#B98255',
          champagne: '#E8D3AE',
          ivory: '#FFF9F0',
          muted: '#81736C',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(104, 70, 56, 0.07)',
        'card': '0 6px 24px -4px rgba(104, 70, 56, 0.08), 0 2px 6px -2px rgba(104, 70, 56, 0.04)',
        'elevated': '0 12px 32px -4px rgba(104, 70, 56, 0.12), 0 4px 12px -2px rgba(104, 70, 56, 0.06)',
      }
    },
  },
  plugins: [],
}

