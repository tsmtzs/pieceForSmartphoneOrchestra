/* eslint-env browser */
// //////////////////////////////////////////////////
// Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// ServiceWorker JavaScript file.
// //////////////////////////////////////////////////
const precacheVersion = self.__precacheManifest
  .map(p => p.revision)
  .join('')
const precacheFiles = self.__precacheManifest
  .map(p => p.url)
  .concat(['/directions', '/instrument'])
  .map(string => self.origin.concat(string))

// Adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(precacheVersion)
      .then(cache => {
        return cache.addAll(precacheFiles)
      })
      .catch(console.log)
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => { return response || fetch(event.request) })
      .then(resp => {
        return caches.open(precacheVersion)
          .then(cache => {
            cache.put(event.request, resp.clone())
            return resp
          })
      })
      .catch(console.log)
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.filter(key => key !== precacheVersion).map(key => caches.delete(key))
      )
    })
  )
})
