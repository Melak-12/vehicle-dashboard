/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#056f80", // Primary color
        secondary: "#4CAF50", // Secondary color (you can replace this with your preferred color)
        third: "#FF6347", // Third color (you can replace this with your preferred color)
      },
    },
  },
  plugins: [],
};
