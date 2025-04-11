import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vite/client" />

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const hostname = new URL(env.VITE_PUBLIC_URL).hostname;

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 4173,
      hmr: {
        protocol: env.VITE_PUBLIC_URL.startsWith("https") ? "wss" : "ws",
        host: hostname,
        clientPort: env.VITE_PUBLIC_URL.startsWith("https") ? 443 : 4173,
      },
      allowedHosts: [
        hostname,
        'chronoquest-frontend',
        'chronoquest-backend',
      ],
      watch: {
        usePolling: false,
      },
    },
    preview: {
      port: 4173,
      host: "0.0.0.0",
      allowedHosts: [
        hostname,
        'chronoquest-frontend',
        'chronoquest-backend',
      ],
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    esbuild: {
      drop: process.env.NODE_ENV === "production" ? ["console"] : [],
    }
  };
});
