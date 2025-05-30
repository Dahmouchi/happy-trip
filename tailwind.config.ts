// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1D4ED8", // Example: custom blue
        secondary: "#F43F5E", // Example: custom red
        main:"#8EBD22",
      },
    },
  },
  plugins: [],
}
export default config
