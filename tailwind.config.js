/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#20262E",
        secondaryTwo: "#393E46",
        secondaryThree: "#566171",
        primary: "#dea000",
        primaryVariant: "rgba(222,160,0,0.06)",
      },
    },
    fontFamily: {
      manrope: ["Manrope}", "sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
