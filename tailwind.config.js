/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "electric-yellow": "#FFD700",
        "electric-blue": "#0066CC",
        "tech-gray": "#2D3748",
      },
    },
  },
  plugins: [],
};
