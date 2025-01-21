import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "sans-serif"],
        base: ["Cairo", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#f88434",
          50: "#feece4",
          100: "#fcd3b9",
          200: "#fbb58d",
          300: "#fa9761",
          400: "#f88040",
          500: "#f88434",
          600: "#d3712e",
          700: "#af5e27",
          800: "#8a4a20",
          900: "#663719",
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
