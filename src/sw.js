/* eslint-env browser */
// //////////////////////////////////////////////////
// Piece for smartphone orchestra
//      by Tassos Tsesmetzis
//
// ServiceWorker JavaScript file.
// //////////////////////////////////////////////////
const cacheName = 'smartphoneOrchestra-v1'

console.log('Halo from service worker!')

// Worker INSTALL event.
// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches
//       .open(cacheName)
//       .then(cache => {
//         return cache.addAll([
//           '/',
//           '/instrument',
//           '/directions',
//           '/smartphoneOrchestra.webmanifest',
//           '/stylesheet.css',
//           '/javascript/parameters.mjs',
//           '/javascript/index.js',
//           '/javascript/instrument.js',
//           '/javascript/discription.js',
//           '/javascript/eventDispatchers.mjs',
//           '/javascript/functionsForPiece.mjs',
//           '/javascript/generalFunctions.mjs',
//           '/javascript/state.mjs',
//           '/javascript/sound.mjs',
//           '/icons/smartphoneOrchestraIcon_192x192.png',
//           '/icons/smartphoneOrchestraIcon_512x512.png'
//         ])
//       })
//       .catch(console.log)
//   )
// })

// // Worker FETCH event
// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => { return response || fetch(event.request) })
//       .then(resp => {
//         return caches.open(cacheName)
//           .then(cache => {
//             cache.put(event.request, resp.clone())
//             return resp
//           })
//       })
//       .catch(console.log)
//   )
// })

// // Worker ACTIVATE event
// self.addEventListener('activate', event => {
//   event.waitUntil(
//     caches.keys().then(keyList => {
//       // TODO: replace 'map' with
//       // 'filter...map'
//       return Promise.all(keyList.map(key => {
//         if (key !== cacheName) return caches.delete(key)
//       }))
//     })
//   )
// })
