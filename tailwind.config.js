/** @type {import('tailwindcss').Config} */
module.exports = {
  content  : [ './public/**/*.html', './src/**/*.{vue,js,ts,jsx,tsx}' ],
  darkMode : 'media',
  theme    : {
    extend: {},
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
