import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  // Configure path aliases
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        format: 'esm' // Ensure ESM format
      }
    }
  }
});
