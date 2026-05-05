/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'forest-night': '#0B160F',
        'forest-deep': '#13241A',
        'forest-mid': '#1F3D2E',
        'forest-moss': '#3C5E47',
        'cream': '#F4F1E8',
        'cream-soft': '#E8E4D6',
        'amber': '#C9A227',
        'amber-light': '#E5BC3A',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        quote: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
