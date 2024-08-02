/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fuschia: {
          100: '#FFF0F7',
          200: '#FFD1E8',
          300: '#FFB3D9',
          400: '#FF94CA',
          500: '#FF76BB',
          600: '#FF57AC',
          700: '#FF389D',
          800: '#FF198E',
          900: '#FF007F',
        },
        violet: {
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
}