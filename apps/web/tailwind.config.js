import { fontFamily } from "tailwindcss/defaultTheme"
import { StaticShadows } from "open-props/src/shadows"

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: ["dark"],
  plugins: [require("@tailwindcss/typography")],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
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
    // fontSize: {
    //   xs: [
    //     "0.875rem",
    //     {
    //       lineHeight: "1rem",
    //       // letterSpacing: '-0.01em',
    //       // fontWeight: '500',
    //     },
    //   ],
    //   sm: [
    //     "1rem",
    //     {
    //       lineHeight: "1.25rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   base: [
    //     "1.125rem",
    //     {
    //       lineHeight: "1.5rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   lg: [
    //     "1.25rem",
    //     {
    //       lineHeight: "1.75rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   xl: [
    //     "1.5rem",
    //     {
    //       lineHeight: "1.75rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   "2xl": [
    //     "1.875rem",
    //     {
    //       lineHeight: "2rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   "3xl": [
    //     "2.25rem",
    //     {
    //       lineHeight: "2.25rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    //   "4xl": [
    //     "3rem",
    //     {
    //       lineHeight: "2.5rem",
    //       // letterSpacing: '-0.02em',
    //       // fontWeight: '700',
    //     },
    //   ],
    // },
    extend: {
      transitionProperty: {
        width: "width",
      },
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        // background: "hsl(var(--background) / <alpha-value>)",
        background: "var(--background)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        tango: "#FF5B19",
        charcoal: "#161616",
        platinum: "#E5E3D2",
        powderBlue: "#AECACD",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["ManRope", ...fontFamily.sans],
      },
    },
  },
}

export default config
