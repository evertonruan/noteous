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
  '/img/cupcake logo.png',
  '/img/social-chain.png']

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
self.addEventListener("fetch", event => {
  console.log(`URL requested: ${event.request.url}`);
});