// 'EventDispatcher' adapted from
// http://www.awwwards.com/build-a-simple-javascript-app-the-mvc-way.html
const _sender = Symbol();
const _listeners = Symbol();
const _dumpFulfilled = Symbol();

class EventDispatcher {
    constructor (sender) {
	this[_sender] = sender;
	this[_listeners] = [];
    }
    attach (listener) {
        this[_listeners].push(listener);
	return this;
    }
    notify () {
	this[_listeners].forEach(listener => {
            listener(this[_sender], ...Array.from(arguments));
	})
    }

    clear () {
	this[_listeners] = [];
    }

    isEmpty () {
	return this[_listeners].length == 0;
    }
}

// Object 'OneShotEventDispatcher' collects listeners that should run
// only once. The method 'attach' pushes a listener function into to
// the '_listeners' container, along with a Boolean function 'conditionFunc'.
// 'conditionFunc' accepts the same arguments as the 'listener'. When an
// 'OneShotEventDispatcher' object notifies it's listeners, it traverses the
// '_listeners' list and collects all the elements for which the 'condition'
// returns 'true'. Then redefines '_listeners' as the array of the remaining
// listeners.
class OneShotEventDispatcher {
    constructor (sender) {
	this[_sender] = sender;
	this[_listeners] = [];
    }

    attach (conditionFunc, ...listeners) {
	listeners.forEach(
	    listener => this[_listeners].push({condition: conditionFunc, listener: listener})
	);

	return this;
    }

    notify () {
	const args = Array.from(arguments);
	const booleanFuncs = [];

	this[_listeners].filter(pair => {
	    return pair.condition(this[_sender], ...args) === true;
	})
	    .forEach(pair => {
		booleanFuncs.push(pair.condition);
		pair.listener(this[_sender], ...args);
	    });

	this[_dumpFulfilled](booleanFuncs);
    }

    [_dumpFulfilled] (funcs) {
	this[_listeners] = this[_listeners].filter(pair => { return !funcs.includes(pair.condition) });
    }

    clear () {
	this[_listeners] = [];
    }

    isEmpty () {
	return this[_listeners].length == 0;
    }
}

export { EventDispatcher, OneShotEventDispatcher };
