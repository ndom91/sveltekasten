import { StaticShadows } from "open-props/src/shadows"
import { fontFamily } from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      boxShadow: {
        xs: StaticShadows["--shadow-1"],
        sm: StaticShadows["--shadow-2"],
        md: StaticShadows["--shadow-3"],
        lg: StaticShadows["--shadow-4"],
        xl: StaticShadows["--shadow-5"],
        "2xl": StaticShadows["--shadow-6"],
        "3xl": [
          "0px 0px 7.6px rgba(0, 0, 0, 0.046)",
          "0px 0px 17.6px rgba(0, 0, 0, 0.067)",
          "0px 0px 31.5px rgba(0, 0, 0, 0.083)",
          "0px 0px 52.3px rgba(0, 0, 0, 0.097)",
          "0px 0px 86.2px rgba(0, 0, 0, 0.113)",
          "0px 0px 150.7px rgba(0, 0, 0, 0.134)",
          "0px 0px 326px rgba(0, 0, 0, 0.18)",
        ],
      },
    },
  },
}

export default config
