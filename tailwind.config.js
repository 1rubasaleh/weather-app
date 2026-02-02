/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        space: ["var(--font-space)"],
        geist: ["var(--font-geist-sans)"],
      },
    },
  },
  plugins: [],
};
