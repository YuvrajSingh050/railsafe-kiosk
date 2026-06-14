import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rail: {
          blue: "var(--rail-blue)",
          "blue-dark": "var(--rail-blue-dark)",
          saffron: "var(--rail-saffron)",
          green: "var(--rail-green)",
          amber: "var(--rail-amber)",
          red: "var(--rail-red)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
