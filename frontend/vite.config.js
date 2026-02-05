import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1000kB since we have heavy 3D assets
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-3d": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-anim": ["framer-motion", "gsap"],
          "vendor-ui": ["react-icons"],
        },
      },
    },
  },
});
