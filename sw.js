self.addEventListener('install', e => {
  console.log('[Service Worker] Install')
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName)
      console.log('[Service Worker] Caching all: app shell and content')
      await cache.addAll(contentToCache)
    })()
  )
})

const cacheName = 'noteousCache'
const contentToCache = [
  '/',
  'index.html',
  'index.js',
  'style.css',
  'orblendEngine.js',
  'about.html',
  'about.js',
  'manifest.json',
  '/img/logo-icon-512.png',
  '/img/cupcake logo.png',
  '/img/preview.png',
  '/img/favicon.png',
  '/img/social-chain.png'
]

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