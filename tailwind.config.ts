import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        wiggle: "wiggle 15s ease-in-out infinite",
        shine: "shine 3s linear infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": {
            transform: "rotate(-1deg) translateY(0px) translateX(0px)",
          },
          "50%": {
            transform: "rotate(1.5deg) translateY(-30px) translateX(2px)",
          },
        },
        shine: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
