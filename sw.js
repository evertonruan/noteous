//noteous SW version = 240712-1

/*
When the user accepts the terms, the Service Worker is installed and adds resources to the cache.
Once they are cached, noteous will use only this local content and will no longer connect to the server to update content.
To update any content: 1. Upload the resource; 2. Change the value in the Service Worker version.
When there are changes in the sw.js file, it will force the Service Worker to update, subsequently updating all resources
(First, in page load, it will update the resources changed and activate (not install) SW new version. When tab is closed and reopened, then new SW version will be installed)
*/


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
        return cachedResponse || fetch(event.request)
    }
  )
 )
})
