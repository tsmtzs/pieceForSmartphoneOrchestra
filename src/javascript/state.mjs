/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
// //////////////////////////////////////////////////
// 'State' object models a hybrid of check boxes and radio buttons.
// Upon initialization you give a number of valid states (aka check boxes - radio buttons).
// State '-1'  is neutral (no button is pressed).
// The method 'changeTo' changes state (presses - deselects a button).
// When the argument is different from the current state, pass it to current state (press radio button).
// When the argument is the same as the current state, change state to neutral (deselect a button)
import { EventDispatcher } from './eventDispatchers.mjs'

class State {
  static NEUTRAL = -1

  #current = State.NEUTRAL
  #previous = State.NEUTRAL
  #listeners
  #allStates

  constructor (...states) {
    if (states.includes(State.NEUTRAL)) {
      throw new Error(`State: The neutral state ${State.NEUTRAL} should not be given as a state.`)
    } else {
      this.#allStates = new Set(states)
      this.#listeners = new EventDispatcher(this)
    }
  }

  changeTo (anInteger) {
    if (this.isValid(anInteger)) {
      this.#previous = this.#current
      this.#current = this.#current === anInteger ? State.NEUTRAL : anInteger
      this.#listeners.notify(anInteger)
    } else {
      throw new Error(`Argument ${anInteger} is not a valid state.`)
    }
  }

  isValid (anInteger) {
    return this.#allStates.has(anInteger)
  }

  get allStates () {
    return Array.from(this.#allStates)
  }

  attachToListeners (listener) {
    this.#listeners.attach(listener)
  }

  removeFromListeners (listener) {
    this.#listeners.remove(listener)
  }

  clearListeners () {
    this.#listeners.clear()
  }

  get current () {
    return this.#current
  }

  get previous () {
    return this.#previous
  }

  isNeutral () {
    return this.#current === State.NEUTRAL
  }

  wasNeutral () {
    return this.#previous === State.NEUTRAL
  }
}

export { State }
