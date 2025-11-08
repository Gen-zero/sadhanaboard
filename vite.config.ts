import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { visualizer } from 'rollup-plugin-visualizer';

// Polyfills for Node.js core modules
import { createRequire } from 'module';
import process from 'process';
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine if we're in production mode
  const isProduction = mode === 'production';
  
  return {
    // Set base path for production deployment
    base: isProduction ? '/' : '/',
    server: {
      host: "::",
      port: 8080,
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**"],
      },
      // Proxy API requests to backend during development
      proxy: {
        '/api': {
          target: isProduction ? 'https://api.sadhanaboard.com' : 'http://localhost:3004',
          changeOrigin: true,
          secure: false,
          ws: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
          configure: (proxy, options) => {
            // Removed VITE_DEV_MODE check since it may not be set
          },
          headers: {
            'X-Forwarded-For': '127.0.0.1',
            'X-Forwarded-Proto': 'http',
            'X-Real-IP': '127.0.0.1'
          },
          timeout: 120000
        },
        '/socket.io': {
          target: isProduction ? 'https://api.sadhanaboard.com' : 'http://localhost:3004',
          ws: true,
          changeOrigin: true,
          secure: false,
          timeout: 120000
        }
      },
    },
    plugins: [
      react(),
      {
        name: 'configure-worker',
        config(config, env) {
          if (env.command === 'build') {
            return {
              worker: {
                format: 'es'
              }
            };
          }
        },
        resolveId(id) {
          // Don't process PDF worker files in special way that causes crypto issues
          if (id.includes('pdf.worker')) {
            return this.resolve(id);
          }
        }
      },
      ViteImageOptimizer({
        /* pass your config */
        test: /\.(jpe?g|png|gif|tiff|webp|svg|avif)$/i,
        exclude: undefined,
        include: undefined,
        includePublic: true,
        logStats: true,
        ansiColors: true,
        svg: {
          multipass: true,
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  cleanupNumericValues: false,
                  convertPathData: false,
                },
              },
            },
            'removeViewBox',
            'cleanupIds',
            'sortAttrs',
            {
              name: 'addAttributesToSVGElement',
              params: {
                attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
              },
            },
          ],
        },
        png: {
          // https://sharp.pixelplumbing.com/api-output#png
          quality: 80,
        },
        jpeg: {
          // https://sharp.pixelplumbing.com/api-output#jpeg
          quality: 80,
        },
        jpg: {
          // https://sharp.pixelplumbing.com/api-output#jpeg
          quality: 80,
        },
        tiff: {
          // https://sharp.pixelplumbing.com/api-output#tiff
          quality: 80,
        },
        // gif does not support lossy compression
        // https://sharp.pixelplumbing.com/api-output#gif
        gif: {},
        webp: {
          // https://sharp.pixelplumbing.com/api-output#webp
          quality: 80,
        },
        avif: {
          // https://sharp.pixelplumbing.com/api-output#avif
          quality: 80,
        },
      }),
      visualizer(), // Add bundle visualizer plugin
      // splitVendorChunkPlugin() has been removed in Vite 5+
      // Vendor chunking is now handled automatically
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@themes": path.resolve(__dirname, "./src/themes"),
        // Add crypto polyfills
        "crypto": "crypto-browserify",
        "stream": "stream-browserify",
        "buffer": "buffer",
        "process": "process/browser",
        "vm": "vm-browserify"
      },
    },
    // Build optimizations
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks - split large dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react')) {
                return 'react-vendor';
              }
              if (id.includes('three')) {
                return 'three-vendor';
              }
              if (id.includes('@radix-ui')) {
                return 'radix-vendor';
              }
              if (id.includes('framer-motion')) {
                return 'framer-vendor';
              }
              if (id.includes('socket.io')) {
                return 'socket-vendor';
              }
              if (id.includes('recharts') || id.includes('victory')) {
                return 'charts-vendor';
              }
              // Catch-all for other vendors
              return 'vendor';
            }
            
            // Component chunks
            if (id.includes('/components/')) {
              if (id.includes('deity')) {
                return 'deity-components';
              }
              if (id.includes('profile')) {
                return 'profile-components';
              }
              if (id.includes('sadhana')) {
                return 'sadhana-components';
              }
              if (id.includes('library')) {
                return 'library-components';
              }
              if (id.includes('ui/')) {
                return 'ui-components';
              }
              return 'components';
            }
            
            // Page chunks - split large landing pages
            if (id.includes('/pages/')) {
              if (id.includes('landing/')) {
                return 'landing-pages';
              }
              if (id.includes('user/')) {
                return 'user-pages';
              }
              return 'pages';
            }
            
            // Hooks and utilities
            if (id.includes('/hooks/')) {
              return 'hooks';
            }
            if (id.includes('/utils/')) {
              return 'utils';
            }
            if (id.includes('/lib/')) {
              return 'lib';
            }
          }
        }
      },
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
    // Add crypto polyfill for build process
    define: {
      global: 'globalThis',
      // Properly define process object for browser environment
      'process.env': '{}',
      'process.browser': 'true',
      'process.version': '""',
    },
    // Add Node.js polyfills
    optimizeDeps: {
      include: ['crypto-browserify', 'stream-browserify', 'buffer', 'process', 'vm-browserify'],
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      }
    },
  };
});