/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
        custom: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "",
        secondary: "#0B1215",
        white : "#FAF9F6",
        borderColor: "#C7C8CC",
        alertColor: "#EF4444",
      },
    },
  },
  plugins: [],
}

