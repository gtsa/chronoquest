import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // React plugin for Vite
  server: {
    port: 3000, // Port for the development server
    host: true, // Expose the server to all network interfaces (useful for Docker)
  },
  preview: {
    port: 4173, // Port for the preview server
    host: true, // Expose the preview server to all network interfaces
    allowedHosts: [
      'chronoquest-frontend',
      'chronoquest-backend'
    ] // Allow this hostname in the preview server
  },
  build: {
    outDir: 'dist', // Output directory for the production build
    emptyOutDir: true, // Clear the output directory before building
  },
});
