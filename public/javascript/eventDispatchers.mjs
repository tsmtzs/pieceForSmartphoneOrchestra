// 'EventDispatcher' adapted from
// http://www.awwwards.com/build-a-simple-javascript-app-the-mvc-way.html
class AbstractEventDispatcher {
  #sender
  #listeners

  constructor (sender) {
    this.#sender = sender
    this.#listeners = new Set()
  }

  get listenerSet () {
    return this.#listeners
  }

  get listeners () {
    return Array.from(this.#listeners)
  }

  get sender () {
    return this.#sender
  }

  clear () {
    this.#listeners.clear()
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
    return this.listenerSize() === 0
  }

  listenerSize () {
    return this.#listeners.size
  }
}

class EventDispatcher extends AbstractEventDispatcher {
  attach (listener) {
    if (listener.constructor !== Function) throw new Error('EventDispatcher.attach argument type error')

    this.listenerSet.add(listener)
    return this
  }

  remove (listener) {
    return this.listenerSet.delete(listener)
  }

  notify (...args) {
    this.listenerSet.forEach(listener => {
      listener(this.sender, ...args)
    })
  }
}

export { EventDispatcher }
