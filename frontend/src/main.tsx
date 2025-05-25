import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./i18n";
import { ThemeProvider } from './context/theme-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

// PROD: Register service worker for PWA caching support
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('Service Worker registered:', reg);
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

// TEMP: Disable any old stale service workers (fallback safeguard)
// if (import.meta.env.PROD && 'serviceWorker' in navigator) {
//   navigator.serviceWorker.getRegistrations().then(regs => {
//     regs.forEach(reg => {
//       console.warn('🧹 Unregistering stale service worker:', reg);
//       reg.unregister();
//     });
//   });
// }
