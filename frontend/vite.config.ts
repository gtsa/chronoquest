import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // React plugin for Vite
  server: {
    port: 4173, // Set the development server to use port 4173
    host: "0.0.0.0", // Expose the server to all network interfaces (important for Docker)
    watch: {
      usePolling: false, // for Ubuntu
    },
  },
  preview: {
    port: 4173, // Keep the preview server on 4173
    host: "0.0.0.0", // Ensure it's accessible from Docker
    allowedHosts: [
      'chronoquest-frontend',
      'chronoquest-backend'
    ],
  },
  build: {
    outDir: 'dist', // Output directory for the production build
    emptyOutDir: true, // Clear the output directory before building
  },
});
