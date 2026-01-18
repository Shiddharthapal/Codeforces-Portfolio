import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import netlify from "@astrojs/netlify";

export default defineConfig({
  output: "server",
  adapter: netlify({
    edgeMiddleware: false,
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
