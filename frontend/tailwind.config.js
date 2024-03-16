/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'], // 'serif' as fallback
        poppins: ['Poppins', 'serif'],
        inter: ['Inter', 'sans-serif']
      },
      fontWeight: {
        // You can include all the font weights here
        400: '400',
        500: '500',
        600: '600',
        700: '700',
        800: '800',
        900: '900',
      },
    },
  },
  plugins: [],
};
