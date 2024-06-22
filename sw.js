const noteousResources = ['/', 'index.html', 'index.js', 'about.html', 'about.js', 'style.css', 'reset.css', 'policies.json', 'orblendEngine.js', 'cupcake-logo.png', 'social-chain.png']

//INSTALLATION
self.addEventListener("install", (event) => {
   let noteousCache = async () => {
      const cache = await caches.open("noteous-resources");
      return cache.addAll(noteousResources);
   };
   event.waitUntil(noteousCache());
});

//ACTIVATION
//Cache cleaning
self.addEventListener('activate', e => {
  console.log("SW activated")
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key === cacheName) {
            return
          }

          return caches.delete(key)
        })
      )
    })
  )
})

//FETCHING
//Connect to serve to see update, then go to cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
        const networkFetch = fetch(event.request).then(response => {
          // update the cache with a clone of the network response
          const responseClone = response.clone()
          caches.open(url.searchParams.get('name')).then(cache => {
            cache.put(event.request, responseClone)
          })
          return response
        }).catch(function (reason) {
          console.error('ServiceWorker fetch failed: ', reason)
        })
        // prioritize cached response over network
        return cachedResponse || networkFetch
      }
    )
  )
})