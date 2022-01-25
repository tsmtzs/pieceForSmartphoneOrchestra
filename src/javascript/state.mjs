/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
// //////////////////////////////////////////////////
// 'State' object models a hybrid of check boxes and radio buttons.
// Upon initialization you give a number of valid states (aka check boxes - radio buttons).
// State '-1'  is neutral (no button is pressed).
// The method 'change' changes state (presses - desellects a button).
// When the argument is different from the current state, pass it to current state (press radio button).
// When the argument is the same as the current state, change state to neutral (deselect a button)
import { EventDispatcher } from './eventDispatchers.mjs'

class State {
  constructor (...states) {
    this.current = -1
    this.all = new Set(states)
    this.hasChanged = false
    this.listeners = new EventDispatcher(this)
  }

  changeTo (anInteger) {
    if (this.all.has(anInteger)) {
      this.current = this.current === anInteger ? (this.hasChanged = false, -1) : (this.hasChanged = true, anInteger)

      this.listeners.notify(anInteger)
    } else {
      throw new Error(`Argument ${anInteger} is not a valid state.`)
    }
  }
}

export { State }
