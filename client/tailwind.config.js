export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if needed
      },
      backgroundImage: {
        'grid-pattern': "url('/grid.svg')",
      },
    },
  },
}
