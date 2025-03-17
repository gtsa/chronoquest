import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vite/client" />

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    host: "0.0.0.0",
    watch: {
      usePolling: false,
    },
  },
  preview: {
    port: 4173,
    host: "0.0.0.0",
    allowedHosts: [
      'chronoquest-frontend',
      'chronoquest-backend'
    ],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  esbuild: {
    drop: process.env.NODE_ENV === "production" ? ["console"] : [],
  }  
});
