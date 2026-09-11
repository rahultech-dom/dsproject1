/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#ECE3D4',
          400: '#DFD2BE',
          500: '#CFC0A8',
        },
        forest: {
          50: '#F2F7F4',
          100: '#DEEDE3',
          200: '#BDDEC8',
          300: '#92C7A3',
          400: '#5FA878',
          500: '#3D8C57',
          600: '#2D7044',
          700: '#245937',
          800: '#1D452B',
          900: '#153320',
          950: '#0C1E13',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E4ECE5',
          200: '#CADACD',
          300: '#A7C1AB',
          400: '#7FA185',
          500: '#5D8364',
          600: '#46674C',
          700: '#37503B',
          800: '#2B3F2E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
