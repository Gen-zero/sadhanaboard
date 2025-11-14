import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Set base path for production deployment
  base: './',
  server: {
    host: "::",
    port: 8080,
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**"],
    },
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:3004',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      '/socket.io': {
        target: 'http://localhost:3004',
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    },
  },
  plugins: [
    react({
      // Fix for useLayoutEffect error in production build
      jsxImportSource: '@emotion/react',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@themes": path.resolve(__dirname, "./src/themes"),
    },
  },
  // Build optimizations
  build: {
    outDir: 'dist',
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000, // 1 MB - warnings for chunks larger than 1 MB
    // Enable minification
    minify: 'esbuild',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize build settings
    target: 'esnext',
    sourcemap: false,
  },
  // Ensure environment variables are properly loaded
  envPrefix: 'VITE_',
});