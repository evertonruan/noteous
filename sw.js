//INSTALLATION
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open('noteousCache')
      await cache.addAll(noteousResources)
    })()
  )
})

const noteousResources = [
  '/',
  'index.html',
  'index.js',
  'about.html',
  'about.js',
  'style.css',
  'reset.css',
  'policies.json',
  'orblendEngine.js',
  '/img/cupcake-logo.png',
  '/img/social-chain.png']

//ACTIVATION
//Cache cleaning
self.addEventListener('activate', e => {
  console.log("SW activated")
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key === 'noteousCache') {
            return
          }

          return caches.delete(key)
        })
      )
    })
  )
})

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
      // It can update the cache to serve updated content on the next request
        return cachedResponse || fetch(event.request);
    }
  )
 )
});