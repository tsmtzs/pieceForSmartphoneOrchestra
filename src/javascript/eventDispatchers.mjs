// 'EventDispatcher' adapted from
// http://www.awwwards.com/build-a-simple-javascript-app-the-mvc-way.html
// TODO: Add an abstract parent class 'AbstractDispatcher'
const sender_ = Symbol('sender')
const listeners_ = Symbol('listeners')
const dumpFulfilled_ = Symbol('dumpFulfilled')

class AbstractEventDispatcher {
  constructor (sender) {
    this[sender_] = sender
    this[listeners_] = new Set()
  }

  get listeners () {
    return Array.from(this[listeners_])
  }

  get sender () {
    return this[sender_]
  }

  clear () {
    this[listeners_].clear()
  }

  attach (listener) {
    throw new Error('Subclass repsonsibility')
  }

  remove (listener) {
    throw new Error('Subclass repsonsibility')
  }

  notify (listener) {
    throw new Error('Subclass repsonsibility')
  }

  isEmpty () {
    return this[listeners_].size === 0
  }

  listenerSize () {
    return this[listeners_].size
  }
}

class EventDispatcher extends AbstractEventDispatcher {
  attach (listener) {
    if (listener.constructor !== Function) throw new Error('EventDispatcher.attach argument type error')

    this[listeners_].add(listener)
    return this
  }

  remove (listener) {
    return this[listeners_].delete(listener)
  }

  notify (...args) {
    this[listeners_].forEach(listener => {
      listener(this[sender_], ...args)
    })
  }
}

// Object 'OneShotEventDispatcher' collects listeners that should run
// only once. The method 'attach' pushes listener functions into to
// the 'listeners_' container, along with a Boolean function 'conditionFunc'.
// 'conditionFunc' accepts the same arguments as the listeners.
class OneShotEventDispatcher extends AbstractEventDispatcher {
  attach (conditionFunc, ...listeners) {
    if (listeners.some(func => func.constructor !== Function)) {
      throw new Error('OneShotEventDispatcher.attach argument type error')
    }

    this[listeners_].add({ condition: conditionFunc, listeners: listeners })

    return this
  }

  notify (...args) {
    const fulfilled = []

    this[listeners_].forEach(pair => {
      if (pair.condition(this[sender_], ...args)) {
        fulfilled.push(pair)
        pair.listeners.forEach(listener => listener(this[sender_], ...args))
      }
    })

    this[dumpFulfilled_](fulfilled)
  }

  [dumpFulfilled_] (listeners) {
    listeners.forEach(pair => this[listeners_].delete(pair))
  }
}

export { EventDispatcher, OneShotEventDispatcher }
