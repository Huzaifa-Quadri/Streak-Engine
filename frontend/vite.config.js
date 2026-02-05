import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-three": ["three"],
          "vendor-drei": ["@react-three/drei"],
          "vendor-fiber": ["@react-three/fiber"],
          "vendor-framer": ["framer-motion"],
          "vendor-gsap": ["gsap"],
          "vendor-ui": ["react-icons"],
        },
      },
    },
    chunkSizeWarningLimit: 1600, // Three.js + Drei is naturally heavy, 1.6MB is a safer realistic limit
  },
});
