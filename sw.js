this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v1').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        'index.js',
        '/style.css',
        '/orblendEngine.js',
        'about.html',
        'about.js',
        '/manifest.json',
        '/img/logo-icon-144.png',
        '/img/logo-icon.png',
        '/img/cupcake logo.png',
        '/img/preview.png',
        '/img/favicon.png',
        '/img/social-chain.png'
      ])
    })
  )
})

//recuperando solicitações com falha
//this.addEventListener('fetch', function (event) {
//  event.respondWith(caches.match('/index.html'))
//})

///

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request)
    })
  )
})

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (resp) {
      return (
        resp ||
        fetch(event.request).then(function (response) {
          return caches.open('v1').then(function (cache) {
            cache.put(event.request, response.clone())
            return response
          })
        })
      )
    })
  )
})

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches
      .match(event.request)
      .then(function (resp) {
        return (
          resp ||
          fetch(event.request).then(function (response) {
            caches.open('v1').then(function (cache) {
              cache.put(event.request, response.clone())
            })
            return response
          })
        )
      })
      .catch(function () {
        return caches.match('/index.html')
      })
  )
})
