/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"], 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#005FA1",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#3d4451",
          input: "#005FA1",
          "base-100": "#ffffff",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#005FA1",
          secondary: "#f6d860",
          accent: "#37cdbe",
          neutral: "#2a2e37",
          input: "black",
          "base-100": "#000000",
        }
      }
    ],
    darkTheme: "dark",
  },
}
