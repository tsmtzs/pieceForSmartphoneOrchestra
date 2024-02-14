/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// Main JavaScript file for views/index.html
// //////////////////////////////////////////////////
// Register the ServiveWorker
// from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(new URL('../serviceWorker.js', import.meta.url), { scope: '/' })
    .catch(error => console.log('Service worker registration failed:', error))
} else {
  console.log('Service workers are not supported.')
}
