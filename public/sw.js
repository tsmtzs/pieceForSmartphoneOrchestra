// //////////////////////////////////////////////////
//	Piece for smartphone orchestra
//			by Tassos Tsesmetzis
//
// ServiceWorker JavaScript file.
// //////////////////////////////////////////////////
const cacheName = 'v1';
const interlayStr = '/views';
const validHtmlPaths = ['instrument'];
//
const isAcceptedHtmlReq = validPaths => req => validPaths.some(elem => req.url.endsWith(elem));
const interlayStrToURL = interString => url => {
    const origin = url.origin;
    const pathname = url.pathname;

    // Return a String object.
    return origin + interString + pathname + '.html';
};
//
const isHtmlReq = isAcceptedHtmlReq(validHtmlPaths);
const interlayToURL = interlayStrToURL(interlayStr);

// Worker INSTALL event.
// adapted from
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
self.addEventListener('install', event => {
    event.waitUntil(
    	caches
    	    .open(cacheName)
    	    .then(cache => {
    	    	return cache.addAll([
    	    	    './',
		    './hss.webmanifest',
    	    	    './views/index.html',
    	    	    './views/pieceInstrument.html',
    	    	    './stylesheet.css',
    	    	    './javascript/index.js',
		    './javascript/piece.js',
		    './javascript/eventDispatchers.mjs',
		    './javascript/functionsForPiece.mjs',
		    './javascript/generalFunctions.mjs',
		    './javascript/state.mjs',
		    './javascript/synth.mjs',
		    './icons/smartphoneOrchestraIcon_192x192.png',
		    './icons/smartphoneOrchestraIcon_512x512.png'
    	    	]);
    	    })
	    .catch(console.log)
    );
});

// Worker FETCH event
self.addEventListener('fetch', event => {
    // Check if request points to '/instrument'
    // If yes, send the corresponding html file from cache.
    const request = isHtmlReq(event.request) ? new Request(interlayToURL(new URL(event.request.url))) : event.request;

    event.respondWith(
	caches.match(request)
	    .then(response => response || fetch(event.request)).then(resp => {
		return caches.open(cacheName).then(cache => {
		    cache.put(event.request, resp.clone());
		    return resp;
		});
	    })
	    .catch(console.log)
    );
});

// Worker ACTIVATE event
self.addEventListener('activate', event => {
    event.waitUntil(
	caches.keys().then(keyList => {
	    return Promise.all(keyList.map(key => {
		if (key == cacheName) return caches.delete(key);
	    }));
	})
    );
});
