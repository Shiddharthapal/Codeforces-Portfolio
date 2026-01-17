import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel({
    // Disable symlinks - copy files instead
    includeFiles: [], 
    functionPerRoute: false, // Use single function
  }),
  
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});