self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed.');
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated.');
  });
  
  self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching something...', event.request.url);
    // Just proxy the request to the network for now
    event.respondWith(fetch(event.request));
  });
  