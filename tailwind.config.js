/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'main': 'var(--color-background)'
      },
      fontSize: {
        'base-10': "62.5%"
      },
      fontFamily: {
        'noto-mono': "Noto Mono, sans-serif"
      },
      maxWidth: {
        '8xl': "120rem"
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
