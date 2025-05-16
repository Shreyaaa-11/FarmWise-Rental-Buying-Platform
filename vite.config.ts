import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // server: {
  //   port: 3000,
  //   open: true,
  //   https: {
  //     key: fs.readFileSync('./.cert/key.pem'),
  //     cert: fs.readFileSync('./.cert/cert.pem'),
  //   },
  //   proxy: {
  //     '/api': {
  //       target: 'https://api.stripe.com',
  //       changeOrigin: true,
  //       secure: true,
  //     }
  //   }
  //},
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
