// //////////////////////////////////////////////////
// An event dispatcher object object for
//	Study for smartphone orchestra
//		Piece A
//			by Tassos Tsesmetzis
// //////////////////////////////////////////////////
// Adapted from
// http://www.awwwards.com/build-a-simple-javascript-app-the-mvc-way.html

export default class EventDispatcher {
    constructor (sender) {
	this._sender = sender;
	this._listeners = [];
    }
    attach (listener) {
        this._listeners.push(listener);
	return this;
    }
    notify () {
        for (let i = 0; i < this._listeners.length; i++) {
            this._listeners[i](this._sender, ...Array.from(arguments));
        }
    }
}