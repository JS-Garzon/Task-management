/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      container: {
      },
      screens: {
        'xl': '1380px',
      },
      maxWidth: {
        'container-xl': '1980px',
      },
      margin: {
        '40p': '40%',
      }

    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

