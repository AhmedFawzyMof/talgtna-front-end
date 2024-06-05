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
          DEFAULT: "#30c6eb",
          50: "#e6f8fd",
          100: "#bfeef7",
          200: "#99e5f1",
          300: "#73dbeb",
          400: "#4dd2e5",
          500: "#30c6eb",
          600: "#29b2d6",
          700: "#229fc2",
          800: "#1b8bad",
          900: "#147898",
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};
