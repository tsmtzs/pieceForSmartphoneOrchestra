/* eslint-env browser */
// //////////////////////////////////////////////////
//  Piece for Smartphone Orchestra
//      by Tassos Tsesmetzis
//
// This file defines the object 'State'. It is a
// hybrid of radio button and check box object.
// //////////////////////////////////////////////////
// 'State' object models a hybrid of check boxes and radio buttons.
// Upon initialization you give a number of valid states (aka check boxes - radio buttons).
// State '-1'  is neutral (no button is pressed).
// The method 'change' changes state (presses - deselects a button).
// When the argument is different than current state, pass it to current state (press radio button).
// When the argument is the same as current state, change state to neutral (deselect a button)
import { EventDispatcher } from './eventDispatchers.mjs'

class State {
  constructor (...states) {
    this.current = -1
    this.all = new Set(states)
    this.hasChanged = false
    this.listeners = new EventDispatcher(this)
  }

  change (anInteger) {
    if (this.all.has(anInteger)) {
      this.current = this.current === anInteger ? (this.hasChanged = false, -1) : (this.hasChanged = true, anInteger)

      this.listeners.notify(anInteger)
    } else {
      throw new Error('Argument is not a valid state.')
    }
  }
}

export { State }